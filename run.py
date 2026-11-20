"""Start the website. Run this file:  python run.py
Then open http://127.0.0.1:5000 in your browser."""
from app import app

if __name__ == '__main__':
    # debug=True auto-reloads when you edit files. Turn it OFF for a live site.
    app.run(host='127.0.0.1', port=5000, debug=True)
