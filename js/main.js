// open 5e to get info about the class
// https://rolz.org to roll stats
//Simplified version of the 5e dnd character sheet

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    generateCharacter();
});

function generateCharacter() {
    const url = `https://api.open5e.com/v1/classes/`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const charClass = document.querySelector('#char-class').value;
            console.log(data.results);
            const currentClass = data.results.find(result => result.name.toLowerCase() == charClass);
            //HD
            const hd = currentClass.hit_dice;
            document.querySelector('#hd').value = hd;
            //HP
            let hdNums = hd.split('d');
            console.log(hdNums);
            const url = `https://rolz.org/api/?${Number(hdNums[0])}d${Number(hdNums[1])}`;
            fetch(url)
                .then(res => res.text()) //Not json!
                .then(data => {
                    let result = Number(data.split('\n')[1].split('=')[1]);
                    document.querySelector('#hp').value = result + Number(document.querySelector('#con').value);
                })
                .catch(error => console.log(`Fetch error: ${error}`));

            //AC
            document.querySelector('#ac').value = 10 + Number(document.querySelector('#con').value);
            //Proficiencies
            document.querySelector('#weapons').value = currentClass.prof_weapons;
            document.querySelector('#armors').value = currentClass.prof_armor;
            document.querySelector('#inventory').value = currentClass.equipment;


            //Roll abilities and modifiers
            const abilities = ['str', 'con', 'dex', 'int', 'wis', 'cha']

            abilities.forEach(ability => {
                //Roll 3d6
                const url = `https://rolz.org/api/?3d6`;
                return fetch(url)
                    .then(res => res.text()) //Not json!
                    .then(data => {
                        let score = Number(data.split('\n')[1].split('=')[1]);
                        document.querySelector(`#${ability}`).value = score;
                        let modifier = abilityModifier(score);
                        modifier = modifier > 0 ? `+${modifier}` : modifier;
                        document.querySelector(`#${ability}-mod`).value = modifier;
                    })
                    .catch(error => console.log(`Fetch error: ${error}`));
            })
        })
        .catch(error => console.log(`Fetch error: ${error}`));
}

function abilityModifier(score) {
    return Math.floor((score - 10) / 2);
}
