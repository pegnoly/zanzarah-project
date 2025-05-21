import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'https://zanzarah-project-api-lyaq.shuttle.app/',
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