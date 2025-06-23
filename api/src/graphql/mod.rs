use mutation::Mutation;
use protected_mutation::ProtectedMutation;
use protected_query::ProtectedQuery;
use query::Query;

pub mod mutation;
pub mod protected_mutation;
pub mod protected_query;
pub mod query;

#[derive(async_graphql::MergedObject, Default)]
pub struct QueryRoot(Query, ProtectedQuery);

#[derive(async_graphql::MergedObject, Default)]
pub struct MutationRoot(Mutation, ProtectedMutation);
