/* template string shall not be used */ 
import $ from "jquery";

export function fetchSermonData(getQuery, k) {
    $.ajax({
        type: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/sermon/search`,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        contentType: 'application/json',
        data: JSON.stringify({ query: getQuery, k: k }),
        success: function (data) {
            $(".sermonTable tbody").empty();
            const sermons = data;
            console.log("Sermons: " + sermons);
            sermons.forEach((sermon, index) => {
                // sermon = JSON.parse(sermon);
                console.log(sermon);
                let title = sermon.title;
                let desc = sermon.desc.slice(0, 100);
                if (desc.length > 0) desc += '...';
                const thumbnail = sermon.thumbnail;
                // const videoUrl = "https://www.youtube.com/watch?v=" + sermon.videoID
                const url = sermon.url;
                $(".sermonTable tbody").append(
                    `<tr>
                    <td>${title}</td>
                    <td>${desc}</td>
                    <td>
                        <a href="${url}">
                            <img src="${thumbnail}" alt="${thumbnail}" width="192" height="108">
                        </a>
                    </td>
                </tr>`);
            });
        },
        error: (xhr, textStatus, error) => {
            console.log(`Error: ${error}`);
        }
    });
}
