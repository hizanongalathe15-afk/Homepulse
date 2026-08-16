export const searchConfig = {
  provider: process.env['SEARCH_PROVIDER'] || 'elasticsearch',
  elasticsearch: {
    node: process.env['ELASTICSEARCH_NODE'] || 'http://localhost:9200',
    username: process.env['ELASTICSEARCH_USERNAME'],
    password: process.env['ELASTICSEARCH_PASSWORD'],
    indexPrefix: process.env['ELASTICSEARCH_INDEX_PREFIX'] || 'homepulse',
    maxResults: Number(process.env['ELASTICSEARCH_MAX_RESULTS']) || 50,
  },
};
