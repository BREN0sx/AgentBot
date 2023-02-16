<h1 align="center">Agent Bot</h1>

> Agent é um bot privado, desenvolvido com Nodejs e Discord.js, com o propósito de automatizar tarefas dentro de um servidor de Discord chamado [Elite Penguin Force](). O servidor reúne administradores, moderadores e desenvolvedores de grandes servidores brasileiros, juntos, formamos uma comunidade onde compartilhamos experiências de administração, ferramentas, metodologias, serviços e muito mais.



## Testando localmente

Primeiramente, [Node.js](https://nodejs.org) precisa estar instalado na máquina.

Clone o projeto localmente

```bash
git clone https://github.com/BREN0sx/AgentBot && cd AgentBot
```

Instale as dependências do projeto

```bash
npm install
```

Antes de iniciar o projeto, é importante criar um arquivo `.env` na raiz do diretório e definir as seguintes variáveis

```env
DISCORD_TOKEN=''
MONGOURL=''
OFFTOPIC_WEBHOOK=''
```

É importante também configurar o arquivo que está localizado no caminho `src/config.js`, caso contrário sua aplicação irá crashar instantâneamente.

```js
module.exports = {
    devID: "", // ID para cargo de desenvolvedor
    master: "", // ID do cargo de Penguin Master
    guard: "", // ID do cargo de Penguin Guard
    agent: "", // ID do Bot
    guild: "", // ID do servidor
    aproveChannel: '', // ID do canal onde será enviado os formulários que serão aprovados
    formChannel: '', // ID do canal onde será enviado o botão para fazer os formulários
    levels: ['', '', ''], // IDs dos cargos de Moderador, Administrador e Dono, respectivamente
    logs: '', // ID do canal de log
    membersForRole: 5, // Quantidade mínima de membros registrados em uma staff para ser criado o cargo do servidor
    serversChannel: '', // ID do canal onde serão enviados as embeds contendo todos os servidores registrados
    formChannelData: {
        developerFormEmoji: '', // Emoji do botão de formulário de desenvolvedor
        guildFormEmoji: '', // Emoji do botão de formulário de novo servidor
        developerFormBanner: '', // Url do banner da embed do formulário de devenvolvedor
        guildFormBanner: '', // Url do banner da embed do formulário de servidor
        developerFormColor: 0xE18002, // Cor do embed de formulário de desenvolvedor
        guildFormColor: 0x66f392, // Cor do embed de formulário de novo servidor
    },
    serversDivRole: '', // Id do cargo imediatamente abaixo dos cargos de servidores
    suggestionsChannel: '', // Id do canal de sugestões
    pendingTag: '', // Id da tag de sugestão pendente
};
```

Inicie o projeto com o comando abaixo

```bash
npm run dev
```
## License

This repository is under the [AGPL-3.0](https://github.com/BREN0sx/AgentBot/blob/main/LICENSE) license.
