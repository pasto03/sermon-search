import { useEffect, useState } from "react";
import "./styles.css";
import { fetchSermonData } from "./fetch_sermons";


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
        <div id="navigation">
            <h1>Sermon Video Live Search</h1>
            <div id="queryBox">
                <input type="text" id="query" placeholder="Search.." onKeyUp={(event) => { keyupHandler(event.target.value) }} />
                <select name="nResults" id="nResults" onChange={(event) => { nResultsHandler(event.target.value) }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>

            <div id="searchResults">
                <table id="sermonTable">
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