import { useEffect, useState } from "react";
import "./styles.css";
import { fetchSermonData } from "./fetch_sermons.jsx";
import ChatInterface from "./chat_interface.jsx";

export default function LiveSearch() {
    const [query, setQuery] = useState("");
    const [k, setK] = useState(5);

    const isOnline = true;

    function keyupHandler(userQuery) {
        setQuery(userQuery);
    }

    function nResultsHandler(nResults) {
        setK(parseInt(nResults));
    }

    // console.log(`Current query: ${query} | k: ${k}`);

    useEffect(() => {
        fetchSermonData(query, k);
    }, [query, k]);

    async function trafficTracker() {
        const body = {
            page: process.env.REACT_APP_PAGE,
            deltaTraffic: 1,
            deltaVisitor: 0,
            accessCode: process.env.REACT_APP_ACCESS_CODE,
        };
        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/traffic`,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "Application/json",
                },
            }
        );
        const data = await response.json();
        console.log(data);
    };

    useEffect(() => {
        if (process.env.REACT_APP_TRAFFIC_MODE === "prod") {
            trafficTracker();
        }
    }, []);

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
            <ChatInterface isOnline={isOnline} />
        </div>
    </div>
}
