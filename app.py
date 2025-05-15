from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

from database.models import db
from api.routes import api_bp

app = Flask(__name__)

# DB config
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "database", "db.sqlite3")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DATABASE_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Init DB and CORS
db.init_app(app)
CORS(app)

# Create tables on startup
with app.app_context():
    db.create_all()

# Register all routes
app.register_blueprint(api_bp, url_prefix="/api")

# Run
if __name__ == "__main__":
    app.run(debug=True)
