# ClientApp

npm i
npm run serve:login

docker pull postgres:16.2
docker run -itd -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 --name mypostgres postgres
"SqlConnection": "Server=localhost; Database=postgres; Port=5432; User Id=postgres; Password=postgres"
