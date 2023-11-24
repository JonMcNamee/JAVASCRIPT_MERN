export function MenuTable({ menuItems, tableClickHandler, selectedItem }) {
    let rows = menuItems.map((item) => {
        const rowClassName = item === selectedItem ? "table-active" : "";
        return (
            <tr
                key={ item.id }
                className={ rowClassName }
                onClick={() => tableClickHandler(item)}            
            >
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.vegetarian ? "Yes" : "No"}</td>
            </tr>
        );
    });
    return (
        <table className="table table-bordered">
            <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Vegetarian</th>
            </tr>
           <tbody>{rows}</tbody> 
        </table>
    );
}