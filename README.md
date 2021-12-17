# Backend da ultima parte do projeto

Link da aplicação: <a target="_blank" href="https://bd-final-backend.herokuapp.com/products">https://bd-final-backend.herokuapp.com/products</a>

| Metodo        | Rotas        | Descrição                      | Parâmetros      |
|     :---:    |     :---:    |     :---:                       |     :---:      |
| GET | / |Retornar uma lista com todos os produtos             | Nenhum |
| GET | /products |Retornar uma lista com todos os produtos     | Nenhum |
| GET | /products/:id |Retornar o produto com o id estabelecido | Nenhum |
| POST| /products | Adiciona um novo produto                | name, amount, sales_avg, description, categories[]|
| DELETE| /products/:id | Remove o produto com o id estabelecido | Nenhum|
| PUT| /products/:id | Atualiza os dados de um produto          | name, amount, sales_avg, description, categories[]|
| GET | /categories |Retornar uma lista com todas as categorias   | Nenhum |
| GET | /categories/:id |Retornar todo os produtos da categoria de id estabelecido | Nenhum |
| POST| /categories/ | Adiciona uma nova categoria             | name |
| DELETE| /categories/:id | Remove a categoria com o id estabelecido | Nenhum|
| PUT| /categories/:id | Atualiza os dados de uma categoria      | name |

