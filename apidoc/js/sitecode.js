const generateStructure = (type, code, response) => {
    let badge;
    if (type === 'json') {
      badge = `
          <span class="new badge teal" data-badge-caption="">
            JSON
          </span>
      `;
    }else{
      badge = `
          <span class="new badge lime darken-2" data-badge-caption="">
            XML
          </span>
      `;
    }

    return (
    `
        <tr>
          <td>
            ${badge}
          </td>
          <td>${code}</td>
          <td>
            <pre>
              <code class="${code}">
                  ${response}
              </code>
            </pre>
          </td>
        </tr>
    `);
  };


var apiData = {
article: [
    {
      link: '/article',
      type: 'post',
      description: '',
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
              response: `{
                error: Error getting related articles!
              }`,
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: '{}'
        },
        {
          code: 200,
          type: 'xml',
          response: '{}',
        }
      ]
    },
    {
      link: '/article/increaseExpFeed/:pubmedId',
      type: 'get',
      description: '',
      canUse: {
        query: {
            'pubmed': 'string',
            'requestType': 'request type string',
        },
      },
      errors: [
          {
              code: 404,
              response: `{
                error: Error getting related articles!
              }`,
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: '{}'
        },
        {
          code: 200,
          type: 'xml',
          response: '<>',
        }
      ]
    },
    {
      link: '/article/decreaseExpFeed/:pubmedId',
      type: 'get',
      description: '',
      canUse: {
        query: {
            'pubmed': 'string',
            'requestType': 'request type string',
        },
      },
      errors: [
          {
              code: 404,
              response: `{
                error: Error getting related articles!
              }`,
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: '{}'
        },
        {
          code: 200,
          type: 'xml',
          response: '<>'
        }
    ]
}],
tweet: [{
    link: '/tweet',
    type: 'post',
    description: '',
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
            response: `{
              error: Error getting tweets!
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: '{}'
      },
      {
        code: 200,
        type: 'xml',
        response: '<>'
      }
    ]
}],
flickr: [{
    link: '/flickr',
    type: 'post',
    description: '',
    canUse: {
      body: {
          'disease_name': 'string',
          'topn': 'int',
          'requestType': 'request type string'
      },
    },
    errors: [
        {
            code: 404,
            response: `{
              error: 'Error getting flickr photos!'
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: '{}'
      },
      {
        code: 200,
        type: 'xml',
        response: '<>'
      }
    ]
}],
metadata: [{
    link: '/metadata',
    type: 'post',
    description: '',
    canUse: {
      body: {
          'disease_name': 'string',
          'requestType': 'request type string',
      },
    },
    errors: [
        {
            code: 404,
            response: `{
              error: 'Error getting metadata!'
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: '{}'
      },
      {
        code: 200,
        type: 'xml',
        response: '<>'
      }
    ]
}],
disease: [{
    link: '/disease',
    type: 'post',
    description: '',
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
            response: `{
              error: 'Error getting related diseases!'
            }`,
            type: 'json'
        }
    ],
    return: [
        {
          code: 200,
          type: 'json',
          response: '{}'
        },
        {
          code: 200,
          type: 'xml',
          response: '<>'
        }
      ]
    },
    {
    link: '/getDiseases',
    type: 'get',
    description: '',
    canUse: {
      query: {
          'contentType': 'request type string',
      },
    },
    errors: [
        {
            code: 404,
            response: `{
              error: 'Error getting related diseases!'
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: '{}'
      },
      {
        code: 200,
        type: 'xml',
        response: '<>'
      }
    ]
  }],
};

//html Generator
let html = '';
const apiSections = ['api-article', 'api-tweet', 'api-flickr', 'api-metadata', 'api-disease'];
const firstLevel = Object.keys(apiData);

firstLevel.forEach((topic, index) => {

  html += `
    <section id="${apiSections[index]}">
  `;

  apiData[topic].forEach((topicElem, indexElem) => {
      html += `
        <div class="card">
          <div class="card-content">
      `;

      html += `
      <table class="striped">
          <thead>
            <tr>
                <th>Type</th>
                <th>Address</th>
                <th>Description</th>
            </tr>
          </thead>
          <tbody>
      `;

      html +=`<tr><td>`;

      const type = topicElem.type;
      if (type === 'get') {
          html +=
          `<span class="new badge red" data-badge-caption="">
              GET
          </span>`;
      } else {
        html +=
        `<span class="new badge blue" data-badge-caption="">
            POST
        </span>`;
      }

      html +=`</td>`;

      const link = topicElem.link;
      html +=`<td>${link}</td>`;

      const description = topicElem.description;
      html +=`<td>${description}</td>`;

      html +=`</tr></tbody></table>`;

      const canUseValues = Object.keys(topicElem.canUse);
      canUseValues.forEach(canUseParam => {
        html +=`
        <ul class="collection with-header">
          <li class="collection-header">
        `;

        html +=`<h6>${canUseParam}</h6>`;

        html +=`</li>`;

        html +=`
        <li class="collection-item">
          <table>
              <thead>
                <tr>
                    <th>name</th>
                    <th>type</th>
                </tr>
              </thead>
              <tbody>
          `;

          const canUseValuesParam = Object.entries(topicElem.canUse[canUseParam]);
          canUseValuesParam.forEach(param => {
            html +=`
              <tr>
                <td>
                  ${param[0]}
                </td>
                <td>
                  ${param[1]}
                </td>
              </tr>
            `;
          });

          html +=`
                </tbody>
              </table>
            </li>
          </ul>`;
      })

      html +=`</div>`;

      html +=`
      <div class="card-tabs">
        <ul class="tabs tabs-fixed-width">
          <li class="tab"><a class="active" href="#apisuccess-${apiSections[index]}-${indexElem}">Success Response</a></li>
          <li class="tab"><a href="#apierror-${apiSections[index]}-${indexElem}">Error Response</a></li>
          <li class="tab"><a href="#apiexample-${apiSections[index]}-${indexElem}">Example</a></li>
        </ul>
      </div>
      `;

      html +=`<div class="card-content grey lighten-4">`;

      html +=`
        <div id="apisuccess-${apiSections[index]}-${indexElem}">
          <table class="striped">
              <thead>
                <tr>
                    <th>Type</th>
                    <th>Code</th>
                    <th>Reponse</th>
                </tr>
              </thead>
              <tbody>
      `;

      topicElem.return.forEach(result => {
          html += generateStructure(result.type, result.code, result.response);
      });

      html += `
              </tbody>
            </table>
        </div>
      `;

      html +=`
        <div id="apierror-${apiSections[index]}-${indexElem}">
          <table class="striped">
              <thead>
                <tr>
                    <th>Type</th>
                    <th>Code</th>
                    <th>Reponse</th>
                </tr>
              </thead>
              <tbody>
      `;

      topicElem.errors.forEach(error => {
          html += generateStructure(error.type, error.code, error.response);
      });

      html += `
              </tbody>
            </table>
        </div>
      `;

      html += `
          <div id="apiexample-${apiSections[index]}-${indexElem}">
            Test 3
          </div>
      `;

      html += `</div></div>`;
  });
  html += `</section>`;
});
//page script
$(document).ready(function(){
    $('#api-content').append(html);
    $('.tabs').tabs();

    $('#api-nav a').each(function() {
      const getValue = $(this).attr('href');
      $(getValue).addClass('hide');
    });

    const getValue = $('#api-nav a:first-child').attr('href');
    $(getValue).removeClass('hide');

    $('#api-nav a').click(function() {
      $('#api-nav a').each(function() {
        const getValue = $(this).attr('href');
        $(getValue).addClass('hide');
      })
      const getValue = $(this).attr('href');
      $(getValue).removeClass('hide');
    });
});
