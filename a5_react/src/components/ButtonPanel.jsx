export function ButtonPanel({ addClickHandler, updateClickHandler, deleteClickHandler, selectedItem }) {
    return (
      <div>
        <button onClick={addClickHandler}>Add</button>
        <button onClick={updateClickHandler} disabled={!selectedItem}>Update</button>
        <button onClick={deleteClickHandler} disabled={!selectedItem}>Delete</button>
      </div>
    );
  }