import { useEffect, useState } from "react";
import "./styles.css";
import { fetchSermonData } from "./fetch_sermons.jsx";

export default function LiveSearch() {
    const [query, setQuery] = useState("");
    const [k, setK] = useState(5);

    function keyupHandler(userQuery) {
        setQuery(userQuery);
    }

    function nResultsHandler(nResults) {
        setK(parseInt(nResults));
    }

    console.log(`Current query: ${query} | k: ${k}`);

    useEffect(() => {
        fetchSermonData(query, k);
    }, [query, k]);


    return <div className="main-container">
        <div className="navigation">
            <h1>Sermon Video Live Search</h1>
            <div className="query-box">
                <input type="text" id="query" placeholder="Enter any keyword..." onKeyUp={(event) => { keyupHandler(event.target.value) }} />
                <select name="nResults" id="nResults" onChange={(event) => { nResultsHandler(event.target.value) }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>

            <div className="searchResults">
                <table className="sermonTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Video</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

        </div>
    </div>
}
