class SymboldSymbolItem {
  constructor(type, client) {
    this.type = type;
    this.symboldClient = client;
  }
  routeMethod(argv) {
    const method = argv._.shift();
    if (!method) {
      return this.showSymbolItemUsage();
    }
    switch (method) {
      case 'delete':
      case 'remove': {
        const symbolServerId = argv._.shift();
        this.removeElement(symbolServerId, argv.itemid);
        break;
      }
      case 'list': {
        const symbolServerid = argv._.shift();
        this.getElement(symbolServerid, argv.page, argv.take);
        break;
      }
      case 'create':
      case 'add': {
        if (this.type === 'skiplist') {
          this.showSymbolItemUsage(`Unknown command`);
        }
        const symbolServerId = argv._.shift();
        this.addElement(symbolServerId, argv.name);
        break;
      }
      default: {
        this.showSymbolItemUsage(`Cannot find a correct method`);
      }
    }
  }

  removeElement(elementId) {
    if (!elementId) {
      return this.showSymbolItemUsage(`Missing symbol item id`);
    }
    const url = `/${this.type}/${elementId}`;
    this.symboldClient.remove(url);
  }

  addElement(symbolServerId, symbolName) {
    if (!symbolServerId) {
      return this.showSymbolItemUsage(`Missing symbol server id`);
    }
    if (!symbolName) {
      return this.showSymbolItemUsage(
        'Empty symbol name. Did you use --name parameter?'
      );
    }
    const url = `/${this.type}/${symbolServerId}`;

    this.symboldClient.post(url, { model: [symbolName] });
  }

  getElement(symbolServerId, page = 0, take = 10) {
    if (!symbolServerId) {
      return this.showSymbolItemUsage(`Missing symbol server id`);
    }
    const url = `/${this.type}/${symbolServerId}?page=${page}&take=${take}`;
    this.symboldClient.get(url);
  }

  showSymbolItemUsage(err) {
    if (err) {
      console.warn(`
      ${err} \n
      `);
    }

    console.warn(`
    Usage: morgue symbold ${this.type} <subcommand:
    
    morgue symbold ${this.type} list [symbolServerId] <--page=...> <--take=...>
        return symbol server with id <symbolServerId> ${this.type}
    
    morgue symbold ${
      this.type
    } <remove | delete> [symbolServerId] [--itemId=...] 
        remove element from ${this.type}

    ${
      this.type !== 'skiplist'
        ? `morgue symbold ${
            this.type
          } <add | create> [symbolServerId] [--name=symbolName]
        add element to symbol server ${this.type}`
        : ''
    }
        
    `);
  }
}

module.exports.SymboldSymbolItem = SymboldSymbolItem;