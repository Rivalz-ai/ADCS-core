from flask import Flask
# from blueprints.meme import meme_bp
from blueprints.GPT4o import gpt4_bp
from blueprints.GPT4mini import gpt4mini_bp
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3013"}})

# app.register_blueprint(meme_bp, url_prefix='/meme')
app.register_blueprint(gpt4_bp, url_prefix='/gpt4')
app.register_blueprint(gpt4mini_bp, url_prefix='/gpt4mini')

if __name__ == '__main__':
    app.run(debug=True,host='localhost',port=3003)
