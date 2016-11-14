# Gumga Layout

**Importante:**
É recomendado que se faça a instalação do projeto como mostrado nos passos abaixo, num diretório fora do projeto onde deseja usa-lo.
Pois o propósito do *gumga-layout* é que seja de fácil customização de cores, fazendo uso de paletas, e também outros detalhes, como tamanhos, fontes e etc, desta forma caso você execute um bower update para uma nova versão, seus arquivos de configuração seriam sobreescritos.
Estando fora do projeto, a chance disso acontecer é bem menor. :)

## Instalação
```
bower install gumga-layout // Recomendado que seja fora do diretório do seu projeto
```

## Exemplos
```
cd caminho/do/gumga-layout
http-server
```

Caso não tenha http-server instalado:
```
npm i http-server -g
```

## Customização

### Paleta de cores
```
cd src/style/palettes/
```
#### Exemplo
```
darkPrimary   = #00796B
primary       = #009688
lightPrimary  = #B2DFDB
textIcons     = #FFFFFF
accent        = #607D8B
primaryText   = #212121
secundaryText = #757575
divider       = #EAEAEA
background    = #F5F5F5
```

### Configurações

```
cd src/style/config
```
* Ícones
* Fontes
* Caminhos para arquivos
* Objetos de customização
  * colors: uso da paleta de cores selecionada
  * layer: organização de elementos por camadas (*z-index*)
  * header
    * height: altura do container header
    * navColor: cor do texto dos links de navegação
    * navColorHover: cor do texto dos links de navegação, no evento hover
    * navBackgroundColorHover: cor de fundo dos link de navegação no evento hover
    * backgroundColor: cor de fundo do header
    * apps
      * navBackgroundColorHover: cor de fundo dos links de navegação no menu de aplicativos
      * backgroundColor: cor de fundo do elemento dropdown do componente de aplicativos
    * notifications
      * navBackgroundColor: cor de fundo dos links de navegação do componente de notificações
      * navBackgroundColorHover: cor de fundo dos links de navegação do componente de notificações no evento hover
      * backgroundColor: cor de fundo do elemento dropdown do componente de notificações
  * nav
    * width: tamanho da largura do container nav
    * menu
      * headerSize: tamanho da fonte do item cabeçalho do menu
      * headerColor: cor da fonte do item cabeçalho do menu
      * navColor: cor do texto dos itens de navegação do menu
      * navColorHover cor do texto dos itens de navegação do menu no evento hover
      * navColorActive: cor do texto do item de navegação ativo do menu
      * navBackgroundColorHover: cor do fundo do bloco de navegação do menu no evento hover
    * scrollTrack: cor do fundo da barra de rolagem
    * scrollThumb: cor da barra de rolagem
    * backgroundColor: cor de fundo do container nav
  * main
  * aside
  * footer
    * height: altura do rodapé, em pixels
    * padding: margem interna do rodapé, em pixels
    * color: cor do texto normal
    * fontSize: tamanho da fonte, em pixels
    * navColor: cor dos links
    * navColorHover: cor dos links quando sobrepostos pelo cursor
    * backgroundColor: cor de fundo


 
#### Exemplo
```
// Palera de cores que será usada
@import '../palettes/gumga'

colors = {
  'darkPrimary': darkPrimary
  'primary': primary,
  'lightPrimary': lightPrimary,
  'textIcons': textIcons,
  'accent': accent,
  'primaryText': primaryText,
  'secundaryText': secundaryText,
  'divider': divider,
  'background': background
}

// Criado para dividir os containers em camadas (z-index)
layer = {
  header: 1003
  nav: 1002
  aside: 1001
  main: 1000
}

header = {
  height: 52px
  navColor: colors.textIcons
  navColorHover: colors.primaryText
  navBackgroundColorHover: colors.primary
  navBackgroundColorFocus: colors.darkPrimary
  backgroundColor: colors.background
  apps: {
    navBackgroundColorHover: colors.lightPrimary
    backgroundColor: colors.textIcons
  }
  notifications: {
    navBackgroundColor: colors.textIcons
    navBackgroundColorHover: colors.lightPrimary
    backgroundColor: colors.background
  }
}

nav = {
  width: 250px
  menu: {
    headerSize: 20px
    headerColor: colors.secundaryText
    navColor: colors.primaryText
    navColorHover: colors.darkPrimary
    navColorActive: colors.primary
    navBackgroundColorHover: colors.background
  }
  scrollTrack: #fff
  scrollThumb: colors.lightPrimary
  backgroundColor: #fff
}

aside = {
  width: 300px
  backgroundColor: #fff
}


main = {
  content: {
    backgroundColor: transparent
  }
}

footer = {
  height: 52px
  padding: 15px
  color: colors.secundaryText
  fontSize: 18px
  navColor: colors.lightPrimary
  navColorHover: colors.darkPrimary
  backgroundColor: colors.primary
}
```

## Instalação de dependências para uso ou desenvolvimento

```npm install```

## Tarefas / Comandos
As tarefas gulp do gumga-layout, ajudam no desenvolvimento, bem como para geração e exportação com suas possíveis customizações.


Comando | Descrição
------------ | -------------
```gulp watch``` | Cria watchers para detectar alterações no código, usado para desenvolvimento.
```gulp bundle``` | Concatena os arquivos e faz o transpilling entre versões.
```gulp release``` | Cria os arquivos já minificados para uso.
```gulp export``` | Cria um diretório numa pasta específica, se informada com parâmetro ```--dest nome_do_dir```, caso contrário gumga-layout. Sempre no seu diretório home.


### TO-DO
- gulp export, verificar pq ícones não está sendo copiado
- gulp export, alterar da home para o diretório corrente, se já houver o diretório, sobreescrever
- Remover ícones em PNG e SVG, manter apenas em webfont (motivo: o pacote tem quase 100mb)