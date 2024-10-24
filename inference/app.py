from flask import Flask
from blueprints.meme import meme_bp
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3013"}})

app.register_blueprint(meme_bp, url_prefix='/meme')

if __name__ == '__main__':
    app.run(debug=True,host='localhost',port=3003)
