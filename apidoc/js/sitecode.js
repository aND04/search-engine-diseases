const convertXML = (xmlString) => xmlString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");


const generateStructure = (type, code, response) => {
    let badge;
    let convertedResponse;
    if (type === 'json') {
      badge = `
          <span class="new badge teal" data-badge-caption="">
            JSON
          </span>
      `;
      convertedResponse = response;
    }else{
      badge = `
          <span class="new badge lime darken-2" data-badge-caption="">
            XML
          </span>
      `;
      convertedResponse = convertXML(response);
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
                  ${convertedResponse}
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
      description: 'Gives an array of pubmed articles with title, abstract, id and date with the array length specified in the topn.',
      canUse: {
        body: {
            'disease_name': 'String',
            'topn': 'Int',
            'requestType': 'Request Type String',
        },
      },
      errors: [
          {
              code: 404,
              response: `
              {
                "error": "Error getting related articles!"
              }`,
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: `
            [
              {
                abstract: "String",
                pub_Date: "Date Time String",
                pubmed_id: "Int",
                title: "string",
              }
            ]`
        },
        {
          code: 200,
          type: 'xml',
          response: `
          <article>
            <article>
              <pubmed_id>Int</pubmed_id>
              <title>String</title>
              <abstract>String</abstract>
              <pub_Date>Date Time String</pub_Date>
            </article>
          </article>
          `,
        }
      ],
      example: {
        types: {
            body: {
              'disease_name': 'Asthma',
              'topn': '3',
              'requestType': 'application/json',
            }
        },
        response: `
          [
            {
              "pubmed_id": 31095758,
              "title": "T3JhbCBjb3J0aWNvc3Rlcm9pZCB1c2UsIG1vcmJpZGl0eSwgYW5kIG1vcnRhbGl0eSBpbiBhc3RobWE6IGEgbmF0aW9ud2lkZSBwcm9zcGVjdGl2ZSBjb2hvcnQgc3R1ZHkgaW4gU3dlZGVuLg==",
              "abstract": "IFBhdHRlcm5zIGFuZCBkZXRlcm1pbmFudHMgb2YgbG9uZy10ZXJtIG9yYWwgY29ydGljb3N0ZXJvaWQgKE9DUykgdXNlIGluIGFzdGhtYSBhbmQgcmVsYXRlZCBtb3JiaWRpdHkgYW5kIG1vcnRhbGl0eSBhcmUgbm90IHdlbGwtZGVzY3JpYmVkLiBJbiBhIG5hdGlvbndpZGUgYXN0aG1hIGNvaG9ydCBpbiBTd2VkZW4sIHdlIGV2YWx1YXRlZCB0aGUgcGF0dGVybnMgYW5kIGRldGVybWluYW50cyBvZiBPQ1MgdXNlIGFuZCByaXNrcyBvZiBPQ1MtcmVsYXRlZCBtb3JiaWRpdGllcyBhbmQgbW9ydGFsaXR5LiBEYXRhIGZvciAyMTcsOTkzIGFzdGhtYSBwYXRpZW50cyAoYWdlZCDiiaU2IHllYXJzKSBpbiBzZWNvbmRhcnkgY2FyZSB3ZXJlIGlkZW50aWZpZWQgYmV0d2VlbiAyMDA3LTIwMTQgdXNpbmcgU3dlZGlzaCBuYXRpb25hbCBoZWFsdGggcmVnaXN0cmllcy4gT0NTIHVzZSBhdCBiYXNlbGluZSB3YXMgY2F0ZWdvcml6ZWQ6IHJlZ3VsYXIgdXNlcnMgKOKJpTUgbWcvZGF5L3llYXI7IG49MzI5OTsgMS41JSk7IHBlcmlvZGljIHVzZXJzICg+MCBidXQgPDUgbWcvZGF5L3llYXI7IG49NDksOTMwOyAyMi45JSk7IGFuZCBub24tdXNlcnMgKDAgbWcvZGF5L3llYXI7IG49MTY0LDc2NTsgNzUuNiUpLiBSZWxhdGl2ZSByaXNrcyBvZiBiZWNvbWluZyBhIHJlZ3VsYXIgT0NTIHVzZXIgYW5kIGZvciBtb3JiaWRpdHkgYW5kIG1vcnRhbGl0eSB3ZXJlIGFuYWx5c2VkIHVzaW5nIG11bHRpdmFyaWFibGUgQ294IHJlZ3Jlc3Npb24uIEF0IGJhc2VsaW5lLCAyNCUgb2YgYXN0aG1hIHBhdGllbnRzIGhhZCB1c2VkIE9DUyBkdXJpbmcgdGhlIGxhc3QgeWVhciBhbmQgMS41JSB3ZXJlIHJlZ3VsYXIgdXNlcnMuIE9mIHRob3NlIG5vdCB1c2luZyBPQ1MgYXQgYmFzZWxpbmUsIDI2JSBjb2xsZWN0ZWQgYXQgbGVhc3Qgb25lIE9DUyBwcmVzY3JpcHRpb24gYW5kIDEuMyUgYmVjYW1lIHJlZ3VsYXIgT0NTIHVzZXJzIGZvciBhdCBsZWFzdCBvbmUgeWVhciBkdXJpbmcgdGhlIG1lZGlhbiBmb2xsb3ctdXAgb2YgNS4zIHllYXJzLiBBZ2UgYXQgYXN0aG1hIGRpYWdub3NpcywgaW5jcmVhc2luZyBHSU5BIHNldmVyaXR5LCBhbmQgQ2hhcmxzb24gQ29tb3JiaWRpdHkgSW5kZXggd2VyZSBhc3NvY2lhdGVkIHdpdGggcmVndWxhciBPQ1MgdXNlLiBDb21wYXJlZCB0byBwZXJpb2RpYyBhbmQgbm9uLU9DUyB1c2UsIHJlZ3VsYXIgdXNlIHdhcyBhc3NvY2lhdGVkIHdpdGggaW5jcmVhc2VkIGluY2lkZW5jZSBvZiBPQ1MtcmVsYXRlZCBtb3JiaWRpdGllcyBhbmQgZ3JlYXRlciBhbGwtY2F1c2UgbW9ydGFsaXR5LCBhZGp1c3RlZCBIUiAxLjM0ICg5NSUgQ0kgMS4yNC0xLjQ1KS4gT0NTIHVzZSBpcyBmcmVxdWVudCBmb3IgYXN0aG1hIHBhdGllbnRzLCBhbmQgbWFueSBhcmUgcmVndWxhciB1c2Vycy4gUmVndWxhciBPQ1MgdXNlIGlzIGFzc29jaWF0ZWQgd2l0aCBpbmNyZWFzZWQgcmlzayBvZiBtb3JiaWRpdHkgYW5kIG1vcnRhbGl0eS4gVGhlc2UgZmluZGluZ3MgaW5kaWNhdGUgdGhhdCB0aGVyZSBpcyBhIG5lZWQgb2Ygb3RoZXIgdHJlYXRtZW50IG9wdGlvbnMgZm9yIHBhdGllbnRzIHdpdGggc2V2ZXJlIGFzdGhtYSB3aG8gYXJlIHVzaW5nIHJlZ3VsYXIgT0NTLiBUaGlzIGFydGljbGUgaXMgcHJvdGVjdGVkIGJ5IGNvcHlyaWdodC4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gVGhpcyBhcnRpY2xlIGlzIHByb3RlY3RlZCBieSBjb3B5cmlnaHQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIA==",
              "pub_Date": "2019-05-16T23:00:00.000Z"
            },
            {
              "pubmed_id": 31095684,
              "title": "R2Vub21lLXdpZGUgYW5hbHlzaXMgcmV2ZWFsZWQgc2V4LXNwZWNpZmljIGdlbmUgZXhwcmVzc2lvbiBpbiBhc3RobWF0aWNzLg==",
              "abstract": "IEdsb2JhbCBnZW5lLWV4cHJlc3Npb24gYW5hbHlzaXMgaGFzIHNob3duIHJlbWFya2FibGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG1hbGVzIGFuZCBmZW1hbGVzIGluIHJlc3BvbnNlIHRvIGV4cG9zdXJlIHRvIG1hbnkgZGlzZWFzZXMuIE5ldmVydGhlbGVzcywgZ2VuZSBleHByZXNzaW9uIHN0dWRpZXMgaW4gYXN0aG1hdGljcyBoYXZlIHNvIGZhciBmb2N1c2VkIG9uIHNleC1jb21iaW5lZCBhbmFseXNpcywgaWdub3JpbmcgaW5oZXJlbnQgdmFyaWFiaWxpdGllcyBiZXR3ZWVuIHRoZSBzZXhlcywgd2hpY2ggcG90ZW50aWFsbHkgZHJpdmUgZGlzcGFyaXRpZXMgaW4gYXN0aG1hIHByZXZhbGVuY2UuIFRoZSBvYmplY3RpdmVzIG9mIHRoaXMgc3R1ZHkgd2VyZSB0byBpZGVudGlmeSAoMSkgc2V4LXNwZWNpZmljIGRpZmZlcmVudGlhbGx5IGV4cHJlc3NlZCBnZW5lcyAoREVHcyksICgyKSBnZW5lcyB0aGF0IHNob3cgc2V4LWludGVyYWN0aW9uIGVmZmVjdHMgYW5kICgzKSBzZXgtc3BlY2lmaWMgcGF0aHdheXMgYW5kIG5ldHdvcmtzIGVucmljaGVkIGluIGFzdGhtYSByaXNrLiBXZSBhbmFseXplZCA3MTEgbWFsZXMgYW5kIDY4OSBmZW1hbGVzIGFuZCBtb3JlIHRoYW4gMi44IG1pbGxpb24gdHJhbnNjcmlwdHMgY292ZXJpbmcgMjDigIkwMDAgZ2VuZXMgbGV2ZXJhZ2VkIGZyb20gZml2ZSBkaWZmZXJlbnQgdGlzc3VlcyBhbmQgY2VsbCB0eXBlcyAoaS5lLiBlcGl0aGVsaWFsLCBibG9vZCwgaW5kdWNlZCBzcHV0dW0sIFQgY2VsbHMgYW5kIGx5bXBob2JsYXN0b2lkcykuIFVzaW5nIHRpc3N1ZS1zcGVjaWZpYyBtZXRhLWFuYWx5c2lzLCB3ZSBpZGVudGlmaWVkIDQzOSBtYWxlLSBhbmQgMjk3IGZlbWFsZS1zcGVjaWZpYyBERUdzIGluIGFsbCBjZWxsIHR5cGVzLCB3aXRoIDMyIGdlbmVzIGluIGNvbW1vbi4gQnkgbGlua2luZyBERUdzIHRvIHRoZSBnZW5vbWUtd2lkZSBhc3NvY2lhdGlvbiBzdHVkeSAoR1dBUykgY2F0YWxvZyBhbmQgdGhlIGx1bmcgYW5kIGJsb29kIGVRVEwgYW5ub3RhdGlvbiBkYXRhIGZyb20gR1RFeCwgd2UgaWRlbnRpZmllZCBmb3VyIG1hbGUtc3BlY2lmaWMgZ2VuZXMgKEZCWEw3LCBJVFBSMyBhbmQgUkFENTFCIGZyb20gZXBpdGhlbGlhbCB0aXNzdWUgYW5kIEFMT1gxNSBmcm9tIGJsb29kKSBhbmQgb25lIGZlbWFsZS1zcGVjaWZpYyBnZW5lIChITEEtRFFBMSBmcm9tIGVwaXRoZWxpYWwgdGlzc3VlKSB0aGF0IGFyZSBkaXNyZWd1bGF0ZWQgZHVyaW5nIGFzdGhtYS4gVGhlIGh5cG94aWEtaW5kdWNpYmxlIGZhY3RvciAxIHNpZ25hbGluZyBwYXRod2F5IHdhcyBlbnJpY2hlZCBvbmx5IGluIG1hbGVzLCBhbmQgSUwtMTcgYW5kIGNoZW1va2luZSBzaWduYWxpbmcgcGF0aHdheXMgd2VyZSBlbnJpY2hlZCBpbiBmZW1hbGVzLiBUaGUgY3l0b2tpbmUtY3l0b2tpbmUgc2lnbmFsaW5nIHBhdGh3YXkgd2FzIGVucmljaGVkIGluIGJvdGggc2V4ZXMuIFRoZSBwcmVzZW5jZSBvZiBzZXgtc3BlY2lmaWMgZ2VuZXMgYW5kIHBhdGh3YXlzIGRlbW9uc3RyYXRlcyB0aGF0IHNleC1jb21iaW5lZCBhbmFseXNpcyBkb2VzIG5vdCBpZGVudGlmeSBnZW5lcyBwcmVmZXJlbnRpYWxseSBleHByZXNzZWQgaW4gZWFjaCBzZXggaW4gcmVzcG9uc2UgdG8gZGlzZWFzZXMuIExpbmtpbmcgREVHIGFuZCBtb2xlY3VsYXIgZVFUTHMgdG8gR1dBUyBjYXRhbG9nIHJlcHJlc2VudHMgYW4gaW1wb3J0YW50IGF2ZW51ZSBmb3IgaWRlbnRpZnlpbmcgYmlvbG9naWNhbGx5IGFuZCBjbGluaWNhbGx5IHJlbGV2YW50IGdlbmVzLiDCqSBUaGUgQXV0aG9yKHMpIDIwMTkuIFB1Ymxpc2hlZCBieSBPeGZvcmQgVW5pdmVyc2l0eSBQcmVzcy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gRm9yIFBlcm1pc3Npb25zLCBwbGVhc2UgZW1haWw6IGpvdXJuYWxzLnBlcm1pc3Npb25zQG91cC5jb20uIA==",
              "pub_Date": "2018-11-29T00:00:00.000Z"
            },
            {
              "pubmed_id": 31095759,
              "title": "SW50ZXJhY3Rpb24gb2YgQWx0IGEgMSB3aXRoIFNMQzIyQTE3IGluIHRoZSBhaXJ3YXkgbXVjb3NhLg==",
              "abstract": "IERlc3BpdGUgYWxsIHRoZSBlZmZvcnRzIG1hZGUgdXAgdG8gbm93LCB0aGUgcmVhc29ucyB0aGF0IGZhY2lsaXRhdGUgYSBwcm90ZWluIGJlY29taW5nIGFuIGFsbGVyZ2VuIGhhdmUgbm90IGJlZW4gZWx1Y2lkYXRlZCB5ZXQuIEFsdCBhIDEgcHJvdGVpbiBpcyB0aGUgbWFqb3IgZnVuZ2FsIGFsbGVyZ2VuIHJlc3BvbnNpYmxlIGZvciBjaHJvbmljIGFzdGhtYSwgYnV0IGxpdHRsZSBpcyBrbm93biBhYm91dCBpdHMgaW1tdW5vbG9naWNhbCBhY3Rpdml0eS4gT3VyIG1haW4gcHVycG9zZSB3YXMgdG8gaW52ZXN0aWdhdGUgdGhlIGxpZ2FuZC1kZXBlbmRlbnQgaW50ZXJhY3Rpb25zIG9mIEFsdCBhIDEgaW4gdGhlIGh1bWFuIGFpcndheSBlcGl0aGVsaXVtLiBBbHQgYSAxIHdpdGggYW5kIHdpdGhvdXQgaXRzIGxpZ2FuZCAoaG9sby0gYW5kIGFwby0gZm9ybXMpIHdhcyBpbmN1YmF0ZWQgd2l0aCB0aGUgcHVsbW9uYXJ5IGVwaXRoZWxpYWwgbW9ub2xheWVyIG1vZGVsLCBDYWx1LTMgY2VsbHMuIEFsbGVyZ2VuIHRyYW5zcG9ydCBhbmQgY3l0b2tpbmUgcHJvZHVjdGlvbiB3ZXJlIG1lYXN1cmVkLiBQdWxsIGRvd24gYW5kIGltbXVub2ZsdW9yZXNjZW5jZSBhc3NheXMgd2VyZSBlbXBsb3llZCB0byBpZGVudGlmeSB0aGUgcmVjZXB0b3Igb2YgQWx0IGEgMSB1c2luZyB0aGUgZXBpdGhlbGlhbCBjZWxsIG1vZGVsIGFuZCBtb3VzZSB0aXNzdWVzLiBSZWNlcHRvci1hbGxlcmdlbi1saWdhbmQgaW50ZXJhY3Rpb25zIHdlcmUgYW5hbHl6ZWQgYnkgY29tcHV0YXRpb25hbCBtb2RlbGluZy4gVGhlIGhvbG8tZm9ybSBjb3VsZCBhY3RpdmF0ZSBodW1hbiBtb25vY3l0ZXMsIFBCTUNzLCBhbmQgcG9sYXJpemVkIGFpcndheSBlcGl0aGVsaWFsIChDYWx1LTMpIGNlbGwgbGluZXMuIFRoZSBhbGxlcmdlbiB3YXMgYWxzbyB0cmFuc3BvcnRlZCB0aHJvdWdoIHRoZSBtb25vbGF5ZXIsIHdpdGhvdXQgYW55IGFsdGVyYXRpb24gb2YgdGhlIGVwaXRoZWxpYWwgaW50ZWdyaXR5IChURUVSKS4gQWx0IGEgMSBhbHNvIGluZHVjZWQgdGhlIHByb2R1Y3Rpb24gb2YgcHJvLWluZmxhbW1hdG9yeSBJTDggYW5kIHNwZWNpZmljIGVwaXRoZWxpYWwgY3l0b2tpbmVzIChJTDMzIGFuZCBJTDI1KSBieSBDYWx1LTMgY2VsbHMuIFRoZSBpbnRlcmFjdGlvbiBiZXR3ZWVuIGVwaXRoZWxpYWwgY2VsbHMgYW5kIGhvbG8tIEFsdCBhIDEgd2FzIGZvdW5kIHRvIGJlIG1lZGlhdGVkIGJ5IHRoZSBTTEMyMkExNyByZWNlcHRvciBhbmQgaXRzIHJlY29nbml0aW9uIG9mIEFsdCBhIDEgd2FzIGV4cGxhaW5lZCBpbiBzdHJ1Y3R1cmFsIHRlcm1zLiBPdXIgZmluZGluZ3MgaWRlbnRpZmllZCB0aGUgQWx0IGEgMSBsaWdhbmQgYXMgYSBjZW50cmFsIHBsYXllciBpbiB0aGUgaW50ZXJhY3Rpb24gb2YgdGhlIGFsbGVyZ2VuIHdpdGggYWlyd2F5IG11Y29zYSwgc2hlZGRpbmcgbGlnaHQgaW50byBpdHMgcG90ZW50aWFsIHJvbGUgaW4gdGhlIGltbXVub2xvZ2ljYWwgcmVzcG9uc2UsIHdoaWxlIHVudmVpbGluZyBpdHMgcG90ZW50aWFsIGFzIGEgbmV3IHRhcmdldCBmb3IgdGhlcmFweSBpbnRlcnZlbnRpb24uIFRoaXMgYXJ0aWNsZSBpcyBwcm90ZWN0ZWQgYnkgY29weXJpZ2h0LiBBbGwgcmlnaHRzIHJlc2VydmVkLiBUaGlzIGFydGljbGUgaXMgcHJvdGVjdGVkIGJ5IGNvcHlyaWdodC4gQWxsIHJpZ2h0cyByZXNlcnZlZC4g",
              "pub_Date": "2019-05-16T23:00:00.000Z"
            }
          ]`
        }
    },
    {
      link: '/article/increaseExpFeed',
      type: 'get',
      description: 'Increases the relevancy of article Id for the designated disease.',
      canUse: {
        query: {
            'pubmed': 'Int',
            'diseaseN': 'String',
            'requestType': 'Request Type String'
        },
      },
      errors: [
          {
              code: 404,
              response: `
              {
                "error": "Error getting related articles!"
              }`,
              type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response: `
          {
            "fieldCount": "Int",
            "affectedRows": "Int",
            "insertId": "Int",
            "serverStatus": "Int",
            "warningCount": "Int",
            "message": "String",
            "protocol41": "Boolean",
            "changedRows": "Int"
          }`
        },
        {
          code: 200,
          type: 'xml',
          response: `
          <article>
            <fieldCount>Int</fieldCount>
            <affectedRows>Int</affectedRows>
            <insertId>Int</insertId>
            <serverStatus>Int</serverStatus>
            <warningCount>Int</warningCount>
            <message>String</message>
            <protocol41>Boolean</protocol41>
            <changedRows>Int</changedRows>
          </article>
          `,
        }
      ],
      example: {
        types: {
            query: {
              "pubmed": 31095758,
              "diseaseN": "Asthma",
              "requestType": "application/json"
            }
        },
        response: `
            {
              "fieldCount": 0,
              "affectedRows": 1,
              "insertId": 0,
              "serverStatus": 2,
              "warningCount": 0,
              "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
              "protocol41": true,
              "changedRows": 1
            }`
        }
    },
    {
      link: '/article/decreaseExpFeed',
      type: 'get',
      description: 'Decreases the relevancy of article Id for the designated disease.',
      canUse: {
        query: {
          'pubmed': 'Int',
          'diseaseN': 'String',
          'requestType': 'Request Type String'
        },
      },
      errors: [
          {
            code: 404,
            response: `
            {
              "error": "Error getting related articles!"
            }`,
            type: 'json'
          }
      ],
      return: [
        {
          code: 200,
          type: 'json',
          response:`
            {
              "fieldCount": "Int",
              "affectedRows": "Int",
              "insertId": "Int",
              "serverStatus": "Int",
              "warningCount": "Int",
              "message": "String",
              "protocol41": "Boolean",
              "changedRows": "Int"
            }`
        },
        {
          code: 200,
          type: 'xml',
          response: `
          <article>
            <fieldCount>Int</fieldCount>
            <affectedRows>Int</affectedRows>
            <insertId>Int</insertId>
            <serverStatus>Int</serverStatus>
            <warningCount>Int</warningCount>
            <message>String</message>
            <protocol41>Boolean</protocol41>
            <changedRows>Int</changedRows>
          </article>`
        }
    ],
    example: {
      types: {
          query: {
            "pubmed": 31095758,
            "diseaseN": "Asthma",
            "requestType": "application/json"
          }
      },
      response: `
        {
          "fieldCount": 0,
          "affectedRows": 1,
          "insertId": 0,
          "serverStatus": 2,
          "warningCount": 0,
          "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
          "protocol41": true,
          "changedRows": 1
        }`
      }
}],
tweet: [{
    link: '/tweet',
    type: 'post',
    description: 'Searches related tweets based on the disease name.',
    canUse: {
      body: {
          'disease_name': 'String',
          'topn': 'Int',
          'requestType': 'Request Type String',
      },
    },
    errors: [
        {
            code: 404,
            response: `
            {
              "error": "Error getting tweets!"
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: `
        [
          {
            "url": "String",
            "description": "String",
            "tweet_date": "Date Time String"
          }
        ]`
      },
      {
        code: 200,
        type: 'xml',
        response: `
        <tweet>
          <tweet>
            <url>String</url>
            <description>String</description>
            <tweet_date>Date Time String</tweet_date>
          </tweet>
        </tweet>`
      }
    ],
    example: {
      types: {
          body: {
            'disease_name': 'Asthma',
            'topn': '3',
            'requestType': 'application/json',
          }
      },
      response: `
      [
        {
          "url": "https://twitter.com/statuses/1129473691975344128",
          "description": "Q29uZ3JhdHMgdG8gQERySk1jS2VvbiBAYWxsZXJneXN0YW5kYXJkICZhbXA7IEBBQUZBTmF0aW9uYWwgU01FIFdpbm5lciBvZiB0aGUgQEFtZXJpY2FuQ2hhbWJlciAmYW1wOyBAcmlhZGF3c29uIFVTIElyZWxhbmTigKYgaHR0cHM6Ly90LmNvL0ZjbVBrenIyZGE=",
          "tweet_date": "Fri May 17 19:48:07 +0000 2019"
        },
        {
          "url": "https://twitter.com/statuses/1129473624514146304",
          "description": "TWFpbiBmdW5jdGlvbiBvZiBFUiBwaHlzaWNpYW4gaXMgdG8gdHJlYXQgbGlmZSB0aHJlYXRlbmluZyBjb25kaXRpb25zIHN1Y2ggYXMgaGVhcnQgYXR0YWNrLCBhY3V0ZSBhdHRhY2sgb2YgYXN0aG1hLOKApiBodHRwczovL3QuY28vQmJkVHRjakIxZw==",
          "tweet_date": "Fri May 17 19:47:51 +0000 2019"
        },
        {
          "url": "https://twitter.com/statuses/1129473220493496320",
          "description": "QFRIRUFsZXhMeTkgbGV0IG1lIGp1c3QgZ2l2ZSB5b3UgbXkgYXN0aG1hIHJlYWwgcXVpY2s=",
          "tweet_date": "Fri May 17 19:46:15 +0000 2019"
        }
      ]`
      }
}],
flickr: [{
    link: '/flickr',
    type: 'post',
    description: 'Searches related pictures on flickr based on the disease name.',
    canUse: {
      body: {
          'disease_name': 'String',
          'topn': 'Int',
          'requestType': 'Request Type String'
      },
    },
    errors: [
        {
            code: 404,
            response: `
            {
              "error": "Error getting flickr photos!"
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: `
        {
          "flickr_date": "Date Time String"
          "title": "String"
          "url": "Image Url String"
        }`
      },
      {
        code: 200,
        type: 'xml',
        response: `
        <flickr>
          <flickr>
            <url>Url String</url>
            <title>String</title>
            <flickr_date>Date Time String</flickr_date>
          </flickr>
        </flickr>
        `
      }
    ],
    example: {
      types: {
          body: {
            'disease_name': 'Asthma',
            'topn': '3',
            'requestType': 'application/json',
          }
      },
      response: `
          [
            {
              "url": "https://farm66.staticflickr.com/65535/47851819891_c0d4f04c7e.jpg",
              "title": "T3JhbnNpIEFzdGhtYSBNb2xkIER1c3QgQWxsZXJnaWVzIFYtSGVwYSBNYXggSEVQQSBGaWx0ZXIgTGFyZ2UgUm9vbSBBaXIgUHVyaWZpZXI=",
              "flickr_date": "2019-05-14 16:04:05"
            },
            {
              "url": "https://farm66.staticflickr.com/65535/47849466631_709dc01f3e.jpg",
              "title": "TGF1bmNoIG9mIE15IEhlYWx0aHkgQ29tbXVuaXR5IFBvcnRhbA==",
              "flickr_date": "2019-05-12 22:25:46"
            },
            {
              "url": "https://farm66.staticflickr.com/65535/47797278272_b3a2e9abe6.jpg",
              "title": "TGF1bmNoIG9mIE15IEhlYWx0aHkgQ29tbXVuaXR5IFBvcnRhbA==",
              "flickr_date": "2019-05-12 22:19:12"
            }
          ]`
      }
}],
metadata: [{
    link: '/metadata',
    type: 'post',
    description: 'Searches relevant information from multiple sources (dbpedia, wikimedia, wikipage) for the searched disease.',
    canUse: {
      body: {
          'disease_name': 'String',
          'requestType': 'Request Type String',
      },
    },
    errors: [
        {
            code: 404,
            response: `
            {
              "error": "Error getting metadata!"
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: `
        [
          {
            "wikipageId": "Int",
            "uri": "Url String",
            "image": "Image Url String",
            "comment": "String"
          }
        ]`
      },
      {
        code: 200,
        type: 'xml',
        response: `
        <metadata>
          <metadata>
            <wikipageId>Int</wikipageId>
            <uri>Url String</uri>
            <image>Image Url String</image>
            <comment>String</comment>
          </metadata>
        </metadata>
        `
      }
    ],
    example: {
      types: {
          body: {
            'disease_name': 'Asthma',
            'topn': '3',
            'requestType': 'application/json',
          }
      },
      response: `
      [
        {
          "wikipageId": 44905,
          "uri": "http://dbpedia.org/resource/Asthma",
          "image": "http://commons.wikimedia.org/wiki/Special:FilePath/Two_Peak_Flow_Meters.jpg",
          "comment": "QXN0aG1hIGlzIGEgY29tbW9uIGxvbmcgdGVybSBpbmZsYW1tYXRvcnkgZGlzZWFzZSBvZiB0aGUgYWlyd2F5cyBvZiB0aGUgbHVuZ3MuIEl0IGlzIGNoYXJhY3Rlcml6ZWQgYnkgdmFyaWFibGUgYW5kIHJlY3VycmluZyBzeW1wdG9tcywgcmV2ZXJzaWJsZSBhaXJmbG93IG9ic3RydWN0aW9uLCBhbmQgYnJvbmNob3NwYXNtLiBTeW1wdG9tcyBpbmNsdWRlIGVwaXNvZGVzIG9mIHdoZWV6aW5nLCBjb3VnaGluZywgY2hlc3QgdGlnaHRuZXNzLCBhbmQgc2hvcnRuZXNzIG9mIGJyZWF0aC4gVGhlc2UgZXBpc29kZXMgbWF5IG9jY3VyIGEgZmV3IHRpbWVzIGEgZGF5IG9yIGEgZmV3IHRpbWVzIHBlciB3ZWVrLiBEZXBlbmRpbmcgb24gdGhlIHBlcnNvbiB0aGV5IG1heSBiZWNvbWUgd29yc2UgYXQgbmlnaHQgb3Igd2l0aCBleGVyY2lzZS4="
        }
      ]`
      }
}],
disease: [{
    link: '/disease',
    type: 'post',
    description: 'Searches for related diseases.',
    canUse: {
      body: {
          'disease_name': 'String',
          'topn': 'Int',
          'requestType': 'Request Type String',
      },
    },
    errors: [
        {
            code: 404,
            response: `
            {
              "error": "Error getting related diseases!"
            }`,
            type: 'json'
        }
    ],
    return: [
        {
          code: 200,
          type: 'json',
          response: `
          [
            {
              "dbpedia_disease_id": "Int",
              "description": "String"
            }
          ]`
        },
        {
          code: 200,
          type: 'xml',
          response: `
            <disease>
              <disease>
                <dbpedia_disease_id>Int</dbpedia_disease_id>
                <description>String</description>
              </disease>
            </disease>`
        }
      ],
      example: {
        types: {
            body: {
              'disease_name': 'Asthma',
              'topn': '3',
              'requestType': 'application/json',
            }
        },
        response: `
            [
              {
                "dbpedia_disease_id": 11,
                "description": "Allergy"
              },
              {
                "dbpedia_disease_id": 4,
                "description": "Tuberculosis"
              },
              {
                "dbpedia_disease_id": 3,
                "description": "Pneumonia"
              }
            ]`
        }
    },
    {
    link: '/getDiseases',
    type: 'get',
    description: 'Gets all diseases in the database to apply on the auto-complete feature.',
    canUse: {
      query: {
          'contentType': 'Request Type String',
      },
    },
    errors: [
        {
            code: 404,
            response: `
            {
              "error": "Error getting diseases for autocomplete!"
            }`,
            type: 'json'
        }
    ],
    return: [
      {
        code: 200,
        type: 'json',
        response: `
        [
          {
            "description": "String"
          },
        ]`
      },
      {
        code: 200,
        type: 'xml',
        response: `
        <disease>
          <disease>
            <description>String</description>
          </disease>
        </disease>
        `
      }
    ],
    example: {
      types: {
          query: {
            'contentType': 'application/json',
          }
      },
      response: `
        [
          {
              "description": "Asthma"
          },
          {
              "description": "Bronchitis"
          },
          {
              "description": "Chronic obstructive pulmonary disease"
          },
          {
              "description": "Cystic fibrosis"
          },
          {
              "description": "Pandemic H1N1/09 Influenza"
          },
          {
              "description": "Pneumocystis jirovecii pneumonia"
          },
          {
              "description": "Pneumonia"
          },
          {
              "description": "Pneumothorax"
          },
          {
              "description": "Respiratory failure"
          },
          {
              "description": "Tuberculosis"
          }
        ]`
      }
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

      html +=`</tr></tbody></table>`;

      const description = topicElem.description;

      html += `
        <table class="striped">
          <thead>
            <tr>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${description}</td>
            </tr>
          </tbody>
        </table>
      `;

      html +=`<h6 style="font-weight: 700; font-size: 16px;">Parameters</h6>`;

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
                    <th>Response</th>
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
                    <th>Response</th>
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


      html +=`
        <div id="apiexample-${apiSections[index]}-${indexElem}">
          <table class="striped">
              <thead>
                <tr>
                    <th>Type</th>
                    <th>Parameters</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <span class="new badge teal" data-badge-caption="">
                    JSON
                  </span>
                </td>
                <td>
      `;

      const typeNames = Object.keys(topicElem.example.types);

      typeNames.forEach(typeName => {
        let exampleHTML = '<ul class="collection">';
        exampleHTML += `<li class="collection-item"><h6>${typeName}</h6></li>`;
        const typeValues = Object.entries(topicElem.example.types[typeName]);
        typeValues.forEach( typeValue => {
            exampleHTML += `<li class="collection-item">${typeValue[0]}: <strong style="font-weight:bold">${typeValue[1]}</strong></li>`;
        });
         exampleHTML += '</ul>';
         html += exampleHTML;
      });

      html += `
                </td>
            </tr>
        </table>
      `;

      html += `
          <h6 style="font-weight: 700; font-size: 16px;">Response</h6>
              <pre>
                <code class="json">
                    ${topicElem.example.response}
                </code>
              </pre>
      `;

      html += `</div></div></div>`;

      if(indexElem < apiData[topic].length - 1) {
          html +=`<div class="divider" style="margin: 30px 0"></div>`;
      }

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

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
});
