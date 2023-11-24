export function AddUpdatePanel({ selectedItem, panelItem, inputChangeHandler, doneClickHandler, resetClickHandler, cancelClickHandler}) {
  return (
  <div>
      <div className="panelItem">
        
        <div className="row col-3">
          <label htmlFor="id">ID:</label>
          <input 
          id="id"
          type="number" 
          onChange={(e) => inputChangeHandler("id", e.target.value)} 
          className="IDinput" 
          value={panelItem ? panelItem.id : 0}
          ></input>
        </div>

        <div className="row col-3">
          <label htmlFor="cat">Category:</label>
          <select 
          id="cat"
          onChange={(e) => inputChangeHandler("category", e.target.value)} 
          className="Categoryinput"
          value={panelItem ? panelItem.category : ""}
          >
              <option value={"APP"}>APP</option>
              <option value={"ENT"}>ENT</option>
              <option value={"DES"}>DES</option>
          </select>
        </div>

        <div className="row col-3">
          <label htmlFor="desc">Description</label>
          <input 
          id="desc"
          onChange={(e) => inputChangeHandler("description", e.target.value)} 
          className="Descriptioninput"
          value={panelItem ? panelItem.description : ""}
          ></input>
        </div>

        <div className="row col-3">
          <label htmlFor="price">Price:</label>
          <input 
          id="price"
          type= "number" 
          onChange={(e) => inputChangeHandler("price", e.target.value)} 
          className="Priceinput"
          value={panelItem ? panelItem.price : 0}
          ></input>
        </div>

        <div className="row col-3">
          <label htmlFor="veg">Vegetarian:</label>
          <input 
          id="veg"
          type="checkbox" 
          onChange={(e) => inputChangeHandler("vegetarian", e.target.checked)} 
          className="Vegetarianinput" 
          checked={panelItem ? panelItem.vegetarian : false}
          ></input>
        </div>
      </div>
  <button onClick = {doneClickHandler}>Done</button>
  <button onClick = {resetClickHandler}>Reset</button>
  <button onClick = {cancelClickHandler}>Cancel</button>
  </div>
  );
}