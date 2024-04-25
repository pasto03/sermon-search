import $ from "jquery";

export function fetchSermonData(getQuery, k) {
    $.ajax({
        type: "POST",
        url: "/search",
        contentType: 'application/json',
        data: JSON.stringify({ query: getQuery, k: k }),
        success: function (data) {
            $("#sermonTable tbody").empty();
            const sermons = data;
            console.log(`Sermons: ${sermons}`);
            sermons.forEach((sermon, index) => {
                // sermon = JSON.parse(sermon);
                console.log(sermon);
                let title = sermon.title;
                let desc = sermon.desc.slice(0, 100);
                if (desc.length > 0) desc += '...';
                const thumbnail = sermon.thumbnail;
                // const videoUrl = "https://www.youtube.com/watch?v=" + sermon.videoID
                const url = sermon.url;
                $("#sermonTable tbody").append(
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