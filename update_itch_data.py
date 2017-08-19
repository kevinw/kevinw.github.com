'''
tools for itchio
'''

import json
import os.path
import urllib2
from datetime import datetime

def import_itch_data():
    'Read games from itch, and write some of the data out to a json file.'

    # pull data from itch.io api
    itch_api_key = os.environ['ITCH_API_KEY']
    url = 'https://itch.io/api/1/' + itch_api_key + '/my-games'
    json_data = urllib2.urlopen(url).read()
    data = json.loads(json_data)

    # include only published games
    data['games'] = [g for g in data['games'] if g['published']]

    # sort games by recent-first
    data['games'].sort(reverse=True, key=lambda g: datetime.strptime(
        g['published_at'], '%Y-%m-%d %H:%M:%S'))

    new_games = []
    for game in data['games']:
        new_game = {}
        for attr in ('title', 'url', 'cover_url', 'short_text', 'created_at'):
            if attr in game:
                new_game[attr] = game[attr]
        new_games.append(new_game)
            
    data['games'] = new_games

    # write to _data directory where jekyll can find it
    with open('_data/itch.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4, separators=(',', ': '))

if __name__ == '__main__':
    import_itch_data()
