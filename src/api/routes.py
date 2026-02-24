"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/user', methods=['POST'])
def create_user():
    body = request.json
    
    user = User()
    user.email = body.get("email")
    user.password = body.get("password")
    user.is_active = True 
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"user": user.serialize()}), 200

@api.route('/login', methods=['POST'])

def login():
    email = request.json.get('email')
    password = request.json.get('password')
    if email is None or password is None:
        return jsonify({"msg": "Email or password is missing in payload"}), 400
    user = User.query.filter_by(email = email).first()
    if user is not None and user.password != password:
        return jsonify({"msg": "Email or password is invalid in payload"}), 400
    
    access_token = create_access_token(identity=email, additional_claims={"user_id": user.id})
    return jsonify({"access_token": access_token}), 400

@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    if users is not None:
        users_list = list(map(lambda user: user.serialize(),users))

        return jsonify({"users": users_list}), 200
    return 'not found', 404

@api.route("/user/<int:user_id>", methods=["DELETE","PUT"]) #
def delete_user(user_id):
    user = User.query.get(user_id) 
    if user is None: 
        return "not found", 404
    if request.method == "PUT":
        is_active = request.json.get('is_active')
        user.is_active = is_active
        db.session.commit() 
        return jsonify({"user": user.serialize()}), 200
    else:
        db.session.delete(user) 
        db.session.commit() 
        return jsonify({"msg": f"User {user_id} deleted"}), 200