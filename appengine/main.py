from __future__ import absolute_import
"""`main` is the top level module for your Flask application."""

# Import the Flask Framework
from flask import Flask, render_template,\
    request, jsonify, abort
from flask.json import JSONEncoder

from settings import GOOGLE_SIGN_IN_CLIENT_ID
# from auth.db import User
from bets.db import Bet, BetAnswer

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ndb.Key):
            return obj.urlsafe()
        if isinstance(obj, datetime.date):
            obj = datetime.datetime(obj.year, obj.month, obj.day)
        return json.JSONEncoder.default(self, obj)

app = Flask(__name__)
app.debug = True
app.secret_key = "whatever"
app.json_encoder = CustomJSONEncoder

@app.context_processor
def extra_context():
    return dict(\
        GOOGLE_SIGN_IN_CLIENT_ID=GOOGLE_SIGN_IN_CLIENT_ID)

@app.route('/')
def index():
    """Return a friendly HTTP greeting."""
    return render_template('index.html')

@app.route('/api/v1/bets', methods="POST")
def api_bet_list():
    json = request.get_json()
    new_bet = Bet(creator_key=request.user_key,
        description=json['description'],
        answers=[BetAnswer(user_key=request.user_key, answer="yes")])
    new_bet.put()
    return jsonify(new_bet)

@app.route('/api/v1/bets/<bet_key_urlsafe>',
    methods=["GET", "POST", "PUT", "DELETE"])
def api_bet(bet_key_urlsafe):
    bet_key = Key(bet_key_urlsafe)
    if request.method == 'DELETE':
        bet_key.delete()
        return jsonify({
            "success": True
        })
    
    else:
        bet = bet_key.get()
        if request.method in ['POST', 'PUT']:
            json = request.get_json()
            bet.description = json['description']
            bet.put()
        
    
        return jsonify(bet)

@app.route('/api/v1/bets/<bet_key_urlsafe>/<answer>', methods=["POST", "PUT"])
def api_bet_answer(bet_key_urlsafe, answer):
    bet = Key(bet_key_urlsafe).get()
    if answer not in ["yes", "no"]:
        return abort(400)

    bet_answer = BetAnswer(user_key=request.user_key, answer=answer)
    for ba in bet.answers:
        if ba.user_key == request.user_key:
            ba.answer = answer
            bet_answer = ba
            break

    bet.answers.append(bet_answer)
    bet.put()
    return jsonify({
        "success": True
    });


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
