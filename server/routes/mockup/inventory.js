inventory = [{id: 1, name: "item 01", description: "item 01 description",price: 100, producttype: "computer"},
        {id: 2, name: "item 02", description: "item 02 description",price: 120, producttype: "computer"}];
module.exports = {
  getItems : function(config,req,res){
    res.send(inventory);
  },
  newItem : function(config,req,res){
    console.log("new item "+ req.body.item);
    req.body.item.id=inventory.length;
    inventory.push(req.body.item);
    res.send(req.body);
  },
  saveItem : function(config,req,res){
    console.log("update item "+ req.body.item);
    for (i = 0; i < inventory.length;i++) {
      if (inventory[i].id == req.body.item.id) {
        inventory[i]=req.body.item;
      }
    }
    res.send(req.body);
  }
}
