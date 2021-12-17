# Backend da ultima parte do projeto

Link da aplicação: <a target="_blank" href="https://bd-final-backend.herokuapp.com/products">https://bd-final-backend.herokuapp.com/products</a>

| Metodo        | Rotas        | Descrição                      | Parâmetros      |
|     :---:    |     :---:    |     :---:                       |     :---:      |
| GET | / |Retornar uma lista com todos os produtos             | Nenhum |
| GET | /products |Retornar uma lista com todos os produtos     | Nenhum |
| GET | /products/:id |Retornar o produto com o id estabelecido | Nenhum |
| POST| /products/:id | Adiciona um novo produto                | name, amount, sales_avg, description, categories[]|
| DELETE| /products/:id | Remove um produto com o id estabelecido | Nenhum|
| PUT| /products/:id | Atualiza os dados de um produto          | name, amount, sales_avg, description, categories[]|

