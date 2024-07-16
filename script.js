document.addEventListener('DOMContentLoaded', () => {
    let myip = document.getElementById("ipget");
    let opensection = document.getElementById('after');
    let errorDisplay = document.getElementById('error-display');

    function ip() {
        opensection.style.display = "none";
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                myip.innerText = data.ip;
                window.userIP = data.ip;
            })
            .catch(err => {
                console.error('Failed to fetch IP:', err);
                errorDisplay.innerText = 'Failed to fetch IP. Please try again later.';
            });
    }

    function getDetailedIPInfo() {
        fetch(`https://ipapi.co/${window.userIP}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('ipgeting').innerHTML = "IP Address: " + data.ip;
                document.getElementById('lat').innerHTML = "Lat: " + data.latitude;
                document.getElementById('city').innerHTML = "City: " + data.city;
                document.getElementById('organ').innerHTML = "Organization: " + data.org;
                document.getElementById('long').innerHTML = "Long: " + data.longitude;
                document.getElementById('reg').innerHTML = "Region: " + data.region;
                document.getElementById('host').innerHTML = "Hostname: " + data.asn;

                document.getElementById('maps').innerHTML = `<iframe src="https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed" width="1390" height="670" frameborder="0" style="border:0; margin-left:60px;box-sizing: border-box;"></iframe>`;

                document.getElementById('timezone').innerHTML = "Time Zone: " + data.timezone;

                let currentDateTime = new Date();
                let formattedDate = currentDateTime.toLocaleDateString();
                let formattedTime = currentDateTime.toLocaleTimeString();   
                document.getElementById('date').innerHTML = "Date and Time: " + formattedDate + " " + formattedTime;

                document.getElementById('pincode').innerHTML = "PinCode: " + data.postal;

                fetch(`https://api.postalpincode.in/pincode/${data.postal}`)
                    .then(response => response.json())
                    .then(postalData => {
                        if (postalData && postalData[0] && postalData[0].Message) {
                            document.getElementById('message').innerHTML = "Messages: " + postalData[0].Message;
                        } else {
                            document.getElementById('message').innerHTML = "Messages: No message found.";
                        }

                        let postOffices = postalData[0].PostOffice;
                        let boxitem = document.getElementById('boxitem');
                        boxitem.innerHTML = ''; 
                        let search = document.getElementById('search');

                        search.addEventListener('keyup', function() {
                            let searching = search.value.toLowerCase();
                            let filteredPostOffices = postOffices.filter(postOffice => postOffice.Name.toLowerCase().includes(searching));

                            boxitem.innerHTML = '';
                            if (filteredPostOffices.length > 0) {
                                filteredPostOffices.forEach((postOffice, i) => {
                                    let row = document.createElement('div');
                                    row.className = 'row';

                                    let col = document.createElement('div');
                                    col.className = 'col-md-6'; 
                                    col.innerHTML = `
                                        <div style="padding:30px;margin-top:30px;margin-left:30px;width: 90%; height: 400px; font-size: 1.3rem; background-color: #575A85; border: 1px solid #575A85; border-radius: 5px; color: white; margin-bottom: 10px;">
                                            <p>Name: ${postOffice.Name}</p>
                                            <p>Branch Type: ${postOffice.BranchType}</p>
                                            <p>Delivery Status: ${postOffice.DeliveryStatus}</p>
                                            <p>District: ${postOffice.District}</p>
                                            <p>Division: ${postOffice.Division}</p>
                                        </div>
                                    `;
                                    row.appendChild(col);
                                    boxitem.appendChild(row);
                                });
                            } else {
                                boxitem.innerHTML = "DATA NOT FOUND";
                                boxitem.style.color = 'red';
                                boxitem.style.fontSize = '1.2rem';
                            }
                        });

                        for (let i = 0; i < postOffices.length; i += 2) {
                            let row = document.createElement('div');
                            row.className = 'row';

                            let col1 = document.createElement('div');
                            col1.className = 'col-md-6'; 
                            col1.innerHTML = `
                                <div style="padding:30px;margin-top:30px;margin-left:30px;width: 90%; height: 400px; font-size: 1.3rem; background-color: #575A85; border: 1px solid #575A85; border-radius: 5px; color: white; margin-bottom: 10px;">
                                    <p>Name: ${postOffices[i].Name}</p>
                                    <p>Branch Type: ${postOffices[i].BranchType}</p>
                                    <p>Delivery Status: ${postOffices[i].DeliveryStatus}</p>
                                    <p>District: ${postOffices[i].District}</p>
                                    <p>Division: ${postOffices[i].Division}</p>
                                </div>
                            `;
                            row.appendChild(col1);

                            if (i + 1 < postOffices.length) {
                                let col2 = document.createElement('div');
                                col2.className = 'col-md-6'; 
                                col2.innerHTML = `
                                    <div style="padding:30px;margin-top:30px;margin-left:30px;width: 90%; height: 400px; font-size: 1.3rem; background-color: #575A85; border: 1px solid #575A85; border-radius: 5px; color: white; margin-bottom: 10px;">
                                        <p>Name: ${postOffices[i + 1].Name}</p>
                                        <p>Branch Type: ${postOffices[i + 1].BranchType}</p>
                                        <p>Delivery Status: ${postOffices[i + 1].DeliveryStatus}</p>
                                        <p>District: ${postOffices[i + 1].District}</p>
                                        <p>Division: ${postOffices[i + 1].Division}</p>
                                    </div>
                                `;
                                row.appendChild(col2);
                            }

                            boxitem.appendChild(row);
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching postal code information:", error);
                        document.getElementById('message').innerHTML = "Error fetching postal code information.";
                    });

                errorDisplay.innerText = '';
            })
            .catch(error => {
                console.error("Error fetching detailed IP info:", error);
                errorDisplay.innerText = 'Error fetching detailed IP info. Please try again later.';
            });
    }

    ip();

    let getstart = document.getElementById("geting");
    getstart.addEventListener('click', function () {
        document.getElementById('one').style.display = 'none';
        document.getElementById('two').style.display = 'none';
        opensection.style.display = "";
        getDetailedIPInfo();
    });
});