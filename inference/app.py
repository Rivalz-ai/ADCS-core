from flask import Flask
# Import blueprints
from blueprints.meme import meme_bp
from blueprints.GPT4o import gpt4_bp
from blueprints.GPT4mini import gpt4mini_bp
from blueprints.GeminiFlash8b import geminiflash8b_bp
from blueprints.GeminiPro import geminipro_bp
from blueprints.GeminiAdvanced import geminiadvanced_bp
from blueprints.GeminiUltr import geminiultr_bp
from blueprints.Qwen import qwen_bp
from  blueprints.asi1 import asi1_bp

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(meme_bp, url_prefix='/meme')
app.register_blueprint(gpt4_bp, url_prefix='/gpt4')
app.register_blueprint(gpt4mini_bp, url_prefix='/gpt4mini')
app.register_blueprint(geminiultr_bp, url_prefix='/geminiultr')
app.register_blueprint(geminiflash8b_bp, url_prefix='/geminiflash8b')
app.register_blueprint(geminipro_bp, url_prefix='/geminipro')
app.register_blueprint(geminiadvanced_bp, url_prefix='/geminiadvanced')
app.register_blueprint(qwen_bp, url_prefix='/Qwen')
app.register_blueprint(asi1_bp, url_prefix="/asi1")

if __name__ == '__main__':
    app.run(debug=True,host='localhost',port=3003)