1. `brew install postgresql`
2. `bundle install`  // Will fail if you don't have postgresql installed first.
3. `brew services start postgresql`
4. `createdb`
5. `psql`

In psql:

1. `create role rails with createdb login password 'password';`

Back in terminal:

1. `rake db:setup`

That's it! Note, you'll lose all your local data while moving to psql.
