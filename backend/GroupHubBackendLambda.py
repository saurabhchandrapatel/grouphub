import json
import boto3
import uuid
from datetime import datetime, timezone
from decimal import Decimal
import re

try:
    dynamodb = boto3.resource("dynamodb")
    groups_table = dynamodb.Table("GroupHubBackendLambdaGroups")
    users_table = dynamodb.Table("GroupHubBackendLambdaUsers")
except Exception as e:
    print(f"Failed to initialize DynamoDB: {e}")
    raise

# Utility to convert DynamoDB Decimals
def convert_decimal(obj):
    try:
        if isinstance(obj, list):
            return [convert_decimal(i) for i in obj]
        if isinstance(obj, dict):
            return {k: convert_decimal(v) for k, v in obj.items()}
        if isinstance(obj, Decimal):
            return int(obj)
        return obj
    except Exception:
        return obj

# ----------------------------
# ROUTER (API GATEWAY HANDLER)
# ----------------------------

def lambda_handler(event, context):
    try:
        path = event.get("path", "")
        method = event.get("httpMethod")

        body = event.get("body")
        if body:
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return respond(400, {"error": "Invalid JSON"})
    except Exception:
        return respond(500, {"error": "Internal server error"})

    # ROUTES
    if path == "/api/groups" and method == "GET":
        return get_groups(event)

    if path == "/api/groups" and method == "POST":
        return create_group(body)

    if path.startswith("/api/groups/") and method == "GET":
        group_id = path.split("/")[-1]
        return get_group(group_id)

    if path.startswith("/api/users/") and method == "GET":
        parts = path.split("/")
        if len(parts) == 4:
            return get_user(parts[-1])
        elif len(parts) == 5 and parts[-1] == "groups":
            return get_user_groups(parts[-2])

    if path.startswith("/api/users/") and method == "PUT":
        user_id = path.split("/")[-1]
        return update_user(user_id, body)

    if "/leave/" in path and method == "POST":
        try:
            _, _, _, user_id, _, group_id = path.split("/")
            return leave_group(user_id, group_id)
        except ValueError:
            return respond(400, {"error": "Invalid path format"})

    if path == "/api/categories":
        return respond(200, [
            "Technology", "Hobbies", "Health & Wellness", "Education",
            "Sports", "Arts & Culture", "Local", "Business"
        ])

    if path == "/api/platforms":
        return respond(200, [
            "Discord", "Telegram", "WhatsApp", "Facebook",
            "LinkedIn", "Slack", "Reddit", "Other"
        ])

    return respond(404, {"error": "Route not found"})

# ----------------------------
# GROUPS
# ----------------------------

def get_groups(event):
    try:
        params = event.get("queryStringParameters") or {}
        search = params.get("search", "")[:100]
        category = params.get("category", "")[:50]
        platform = params.get("platform", "")[:50]
        
        response = groups_table.scan()
        items = response.get("Items", [])
    except Exception:
        return respond(500, {"error": "Failed to fetch groups"})

    # Filters in Lambda (DDB cannot OR search easily)
    result = []
    try:
        for g in items:
            if search:
                if search.lower() not in g["name"].lower() and search.lower() not in g["description"].lower():
                    continue

            if category and category != "All Categories" and g["category"] != category:
                continue

            if platform and platform != "All Platforms" and g["platform"] != platform:
                continue

            result.append(g)
    except KeyError:
        return respond(500, {"error": "Invalid group data structure"})

    return respond(200, convert_decimal(result))


def get_group(group_id):
    try:
        if not re.match(r'^[a-zA-Z0-9-]+$', group_id):
            return respond(400, {"error": "Invalid group ID"})
        res = groups_table.get_item(Key={"id": group_id})
        if "Item" not in res:
            return respond(404, {"error": "Group not found"})
        return respond(200, convert_decimal(res["Item"]))
    except Exception:
        return respond(500, {"error": "Failed to fetch group"})


def create_group(data):
    try:
        group_id = str(uuid.uuid4())

        image = data.get("image") or f"https://api.dicebear.com/7.x/initials/svg?seed={data['name']}"

        item = {
            "id": group_id,
            "name": data["name"],
            "description": data["description"],
            "long_description": data.get("long_description"),
            "category": data["category"],
            "platform": data["platform"],
            "members": 1,
            "image": image,
            "link": data.get("link"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        groups_table.put_item(Item=item)
        return respond(200, item)
    except KeyError:
        return respond(400, {"error": "Missing required fields"})
    except Exception:
        return respond(500, {"error": "Failed to create group"})

# ----------------------------
# USERS
# ----------------------------

def get_user(user_id):
    try:
        if not re.match(r'^[a-zA-Z0-9-]+$', user_id):
            return respond(400, {"error": "Invalid user ID"})
        res = users_table.get_item(Key={"id": user_id})
        if "Item" not in res:
            return respond(404, {"error": "User not found"})
        return respond(200, convert_decimal(res["Item"]))
    except Exception:
        return respond(500, {"error": "Failed to fetch user"})


def get_user_groups(user_id):
    try:
        res = users_table.get_item(Key={"id": user_id})
        if "Item" not in res:
            return respond(404, {"error": "User not found"})

        joined_groups = res["Item"].get("joined_groups", [])

        if not joined_groups:
            return respond(200, [])

        keys = [{"id": g_id} for g_id in joined_groups]
        response = dynamodb.batch_get_item(
            RequestItems={groups_table.name: {"Keys": keys}}
        )

        groups = response.get("Responses", {}).get(groups_table.name, [])
        return respond(200, convert_decimal(groups))
    except Exception:
        return respond(500, {"error": "Failed to fetch user groups"})


def update_user(user_id, data):
    try:
        update_expression = []
        expr_attr_values = {}
        expr_attr_names = {}

        for key, value in data.items():
            attr_name = f"#attr_{len(update_expression)}"
            attr_value = f":val_{len(update_expression)}"
            update_expression.append(f"{attr_name} = {attr_value}")
            expr_attr_names[attr_name] = key
            expr_attr_values[attr_value] = value

        update_expr = "SET " + ", ".join(update_expression)

        users_table.update_item(
            Key={"id": user_id},
            UpdateExpression=update_expr,
            ExpressionAttributeNames=expr_attr_names,
            ExpressionAttributeValues=expr_attr_values
        )

        updated_res = users_table.get_item(Key={"id": user_id})
        if "Item" not in updated_res:
            return respond(404, {"error": "User not found"})
        return respond(200, updated_res["Item"])
    except Exception:
        return respond(500, {"error": "Failed to update user"})


def leave_group(user_id, group_id):
    try:
        user_res = users_table.get_item(Key={"id": user_id})
        if "Item" not in user_res:
            return respond(404, {"error": "User not found"})

        user = user_res["Item"]
        groups = user.get("joined_groups", [])

        if group_id in groups:
            groups.remove(group_id)

        users_table.update_item(
            Key={"id": user_id},
            UpdateExpression="SET joined_groups = :g",
            ExpressionAttributeValues={":g": groups}
        )

        return respond(200, {"message": "Left group successfully"})
    except Exception:
        return respond(500, {"error": "Failed to leave group"})

# ----------------------------
# RESPONSE WRAPPER
# ----------------------------

def respond(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": json.dumps(body)
    }