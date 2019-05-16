export default = {
article: [
    {
      link: '/article',
      type: 'post',
      canUse: {
        body: {
            'disease_name': 'string',
            'topn': 'int',
            'requestType': 'request type string',
        },
      },
      errors: [
          {
              code: 404,
              message: 'Error getting related articles!',
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: {}
        },
        {
          code: 200,
          type: 'xml'
          response: {},
        }
      ]
    },
    {
      link: '/article/increaseExpFeed/:pubmedId',
      type: 'get',
      canUse: {
        query: {
            'pubmed': 'string',
            'requestType': 'request type string',
        },
      },
      errors: [
          {
              code: 404,
              message: 'Error getting related articles!'',
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: {}
        },
        {
          code: 200,
          type: 'xml'
          response: {},
        }
      ]
    },
    {
      link: '/article/decreaseExpFeed/:pubmedId',
      type: 'get',
      canUse: {
        query: {
            'pubmed': 'string',
            'requestType': 'request type string',
        },
      },
      errors: [
          {
              code: 404,
              message: 'Error getting related articles!',
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: {}
        },
        {
          code: 200,
          type: 'xml'
          response: {},
        }
      ]
    }
],
tweet: {
    link: '/tweet',
    type: 'post',
    canUse: {
      body: {
          'disease_name': 'string',
          'topn': 'int',
          'requestType': 'request type string',
      },
    },
    errors: [
        {
            code: 404,
            message: 'Error getting tweets!',
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: {}
      },
      {
        code: 200,
        type: 'xml'
        response: {},
      }
    ]
},
flickr: {
    link: '/flickr',
    type: 'post',
    canUse: {
      body: {
          'disease_name': 'string',
          'topn': 'int',
          'requestType': 'request type string',
      },
    },
    errors: [
        {
            code: 404,
            message: 'Error getting flickr photos!',
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: {}
      },
      {
        code: 200,
        type: 'xml'
        response: {},
      }
    ]
},
metadata: {
    link: '/metadata',
    type: 'post',
    canUse: {
      body: {
          'disease_name': 'string',
          'requestType': 'request type string',
      },
    },
    errors: [
        {
            code: 404,
            message: 'Error getting metadata!',
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: {}
      },
      {
        code: 200,
        type: 'xml'
        response: {},
      }
    ]
},
disease: {
    link: '/disease',
    type: 'post',
    canUse: {
      body: {
          'disease_name': 'string',
          'topn': 'int',
          'requestType': 'request type string',
      },
    },
    errors: [
        {
            code: 404,
            message: 'Error getting related diseases!',
            type: 'json'
        }
    ],
    return: [
        {
          code: 200,
          type: 'json',
          response: {}
        },
        {
          code: 200,
          type: 'xml'
          response: {},
        }
      ]
    },
    {
    link: '/getDiseases',
    type: 'get',
    canUse: {
      query: {
          'contentType': 'request type string',
      },
    },
    errors: [
        {
            code: 404,
            message: 'Error getting related diseases!',
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: {}
      },
      {
        code: 200,
        type: 'xml'
        response: {},
      }
    ]
  }
}
