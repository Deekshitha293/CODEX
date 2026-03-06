from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def home():
    songs = [
        {"title": "Song 1", "filename": "song1.mp3"},
        {"title": "Song 2", "filename": "song2.mp3"},
    ]
    return render_template('index.html', songs=songs)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
