import logging
from google.appengine.ext import ndb

class BetAnswer(ndb.Model):
    user_key = ndb.KeyProperty(kind="User", required=True)
    answer = ndb.StringProperty(choices=["yes", "no"], required=True)

class Bet(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    creator_key = ndb.KeyProperty(kind="User", required=True)
    description = ndb.StringProperty(required=True)
    answers = ndb.StructuredProperty(BetAnswer, repeated=True)
