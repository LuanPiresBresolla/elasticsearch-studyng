import elasticsearch from 'elasticsearch';

export function ElasticSearch() {
  const cliente = new elasticsearch.Client({
    host: 'localhost:9200',
    // log: 'trace',
  });

  return  cliente;
}