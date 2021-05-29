import json
from flask import Flask, request
from flask_cors import CORS, cross_origin
import git

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/commandBatch', methods=['POST'])
@cross_origin()
def cmd():
    requestJson = request.get_json()
    if 'commitMessage' in requestJson:
        file = open('msg.txt', 'w')
        file.write(requestJson['commitMessage'])
    git.gitStart(requestJson['projectPath'], requestJson['commandBatch'])
    return 'res'


if __name__ == '__main__':
    app.run(debug=True)

