import express from 'express';
import { ElasticSearch } from './libs/ElasticSearch';
import importProdutos from '../produtos.json';

const app = express();

interface IProduto {
  RecordSet: {
    IDPRODUTO: number;
    NOME: string;
    PRECO_VENDA: number;
  }[];
}

app.post('/import', async (request, response) => {
  const elastic = ElasticSearch();

  const produtos = importProdutos as IProduto;

  for await (const produto of produtos.RecordSet) {
    try {
      await elastic.index({
        index: 'produtos',
        type: 'type_produtos',
        body: {
          idproduto: produto.IDPRODUTO,
          nome: produto.NOME,
          preco_venda: produto.PRECO_VENDA,
        }
      });
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }

  return response.json({ message: 'Importação finalizada' });
});

app.get('/products/:id', async (request, response) => {
  const { id } = request.params;
  
  const elastic = ElasticSearch();

  const data = await elastic.search({
    index: 'produtos',
    q: `idproduto:${id}`
  })

  return response.json(data.hits.hits);
});

app.get('/products', async (request, response) => {
  const { search } = request.query;
  
  const elastic = ElasticSearch();

  const data = await elastic.search({
    index: 'produtos',
    size: 10000,
    body: {
      query: {
        match: {
          'nome.keyword': search
        }
      }
    }
  })

  return response.json(data.hits.hits);
});

app.post('/products', async (request, response) => {
  const product = {
    idproduto: 27908445,
    nome: "WERNER SANDALIA 45 CAM PRATA",
    preco_venda: 787
  }

  const elastic = ElasticSearch();

  const data = await elastic.index({
    index: 'produtos',
    type: 'type_produtos',
    body: product
  });

  return response.json(data);
});

app.listen(3333, () => console.log('Server started in port 3333'));