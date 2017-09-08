from itertools import combinations, chain
from pymongo import MongoClient


seq = list(range(1, 7))
combs = chain(*[list(combinations(seq, i)) for i in seq])

def encode(l):
    output = 0
    for i in l:
        output |= 1 << (i - 1)
    return output

patterns = [0] + list(map(encode, combs))

def get_sequences():
    mongoClient = MongoClient()
    collection = mongoClient['flicker']['sequences']
    data = collection.find()
    patterns = []
    for p in data:
        patterns.append({
            'name' : p['name'],
            'sequence': p['sequence']
        })
    return patterns

sequences = get_sequences()

def make_arduino_string(sequence):
    output = '/* {} */ {{ '.format(sequence['name'])
    for state in sequence['sequence']:
        pattern = patterns[int(state['perm'])]
        duration = float(state['time'])
        output +=  '{{ {}, {:2.1f}f }}, '.format(pattern, duration)
    output += '{ END_PATTERN, 0.f }'
    output += '},'
    return output

for l in [make_arduino_string(p) for p in sequences]:
    print(l)
        
