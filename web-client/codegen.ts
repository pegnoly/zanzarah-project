import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'https://zz-webapi-cv7m.shuttle.app/',
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './app/graphql/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  }
}
 
export default config