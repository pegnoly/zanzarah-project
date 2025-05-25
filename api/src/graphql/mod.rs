use mutation::Mutation;
use protected_mutation::ProtectedMutation;
use protected_query::ProtectedQuery;
use query::Query;

pub mod mutation;
pub mod query;
pub mod protected_query;
pub mod protected_mutation;

#[derive(async_graphql::MergedObject, Default)]
pub struct QueryRoot(Query, ProtectedQuery);

#[derive(async_graphql::MergedObject, Default)]
pub struct MutationRoot(Mutation, ProtectedMutation);