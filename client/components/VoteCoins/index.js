import React, { useState, useEffect } from 'react'

var timeout = null;
var steps = ['Setting Election Time', 'Generating Encryption Keys', 'Providing Vote Coins to the Voters', 'Completed!'];

export default function index() {
    const [progress, setValue] = useState(0);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        increase();

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(()  => {
        if (progress >= 100) {
            setIndex(3);
            clearTimeout(timeout);
        }
       
        if (progress >= 20 && progress < 55) {
            setIndex(1);
        } else if (progress >= 55 && progress < 100) {
            setIndex(2);
        }

    }, [progress]);

    const increase = () => {
        if (progress >= 100) {
            clearTimeout(timeout);
            return;
        }

        setValue(val => val + 1);
        timeout = setTimeout(increase, 50);
    }


    return (
        <div className="box" style={{position: 'relative'}}>
            <h2 className="subtitle">Election Creation</h2>
            <progress style={{width: '50%', height: '20px', color: 'green'}} max="100" value={progress}>{progress}%</progress>
            <p style={{position: 'absolute', right: '465px', top: '65px'}}>{progress}%</p>
            <pre style={{background: 'transparent', padding: '0', color: progress >= 100 ? '#48c774' : '#222'}}>{steps[index]}</pre>
        </div>
    )
}
