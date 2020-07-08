import React, { Component } from 'react';
import './MineArea.css';

var gameOver = false;
var boxOpened = 0;
function renderTable(row, col, mine, nearCount, changeFlagCount, getFlagCount) {
    return <tbody>{[...Array(row)].map((e,i) => {
        return <tr key={i}>{[...Array(col)].map((e,j) => {
            if(mine.indexOf((i*col)+j) !== -1) {
                return <td key={j} className={'w-'+col} id={i+'-'+j} onMouseOver={e => highlightAround(i, j, row, col)} onClick={e => showItem(e, i, j, col, nearCount, mine, changeFlagCount)} onContextMenu={e => showFlag(e, changeFlagCount, getFlagCount)}><img src="https://img.icons8.com/ios-glyphs/20/000000/naval-mine.png" className="inner-item" alt="mine" /><img src="https://img.icons8.com/officel/20/000000/filled-flag.png" className="flag-item" alt="flag"/></td>
            } else {
                return <td key={j} className={'w-'+col} id={i+'-'+j} onMouseOver={e => highlightAround(i, j, row, col)} onClick={e => {showItem(e, i, j, col, nearCount, mine, changeFlagCount).then(checkGameWin(row*col, getFlagCount,mine.length))}} onContextMenu={e => showFlag(e, changeFlagCount, getFlagCount)}><span className="inner-item">{(nearCount[(i*col)+j] === 0)? '': nearCount[(i*col)+j]}</span><img src="https://img.icons8.com/officel/20/000000/filled-flag.png" className="flag-item" alt="flag"/></td> // {(i*col)+j} is the ith cell
                // img of flag
                // <img src="https://img.icons8.com/officel/20/000000/filled-flag.png"/>
            }
        })}</tr>
    })}</tbody>
}
function boxOpen(node, changeFlagCount) {
    if(node !== null) {
        if(node.style.cursor === 'pointer') {
            boxOpened += 1;
        }
        node.firstChild.classList.add('showMe');
        node.style.cursor = 'default';
        node.classList.add('visible');
        if(node.children[1].style.display === 'inline') {
            node.children[1].style.display = 'none';
            changeFlagCount(1);
        }
    }
}
function showItem(e, i, j, col, nearCount, mine, changeFlagCount) {
    e.preventDefault(e);
    if(!gameOver) {
        if(nearCount[(i*col)+j] === 0) {
            openBlanks(e.currentTarget, i, j, col, nearCount, changeFlagCount);
        } else if (nearCount[(i*col)+j] === -1) {
            openMines(e.currentTarget, mine, col, changeFlagCount)
        } else {
            boxOpen(e.currentTarget, changeFlagCount);
        }
    }
    return false;
}
function showFlag(e, changeFlagCount, getFlagCount) {
    e.preventDefault();
    if(getFlagCount() > 0 && !gameOver) {
        if(e.currentTarget.children[1].style.display === 'inline') {
            e.currentTarget.children[1].style.display = 'none';
            changeFlagCount(1);
        } else {
            if(!e.currentTarget.firstChild.classList.contains('showMe')) {
                e.currentTarget.children[1].style.display = 'inline';
                changeFlagCount(-1);
            }
        }
    }
    return false;
}
function subOpenBlanks(i, j, col, nearCount, changeFlagCount) {
    if(document.getElementById((i)+'-'+(j)) !== null) {
        if(nearCount[((i)*col)+(j)] !== 0) {
            boxOpen(document.getElementById((i)+'-'+(j)), changeFlagCount);
        } else {
            if(!document.getElementById((i)+'-'+(j)).firstChild.classList.contains('showMe')) {
                openBlanks(document.getElementById((i)+'-'+(j)), i, j, col, nearCount, changeFlagCount);
            }
        }
    }
}
function openBlanks(node, i, j, col, nearCount, changeFlagCount) {
    boxOpen(node, changeFlagCount);
    subOpenBlanks(i-1, j-1, col, nearCount, changeFlagCount);
    subOpenBlanks(i-1, j, col, nearCount, changeFlagCount);
    subOpenBlanks(i-1, j+1, col, nearCount, changeFlagCount);
    subOpenBlanks(i, j-1, col, nearCount, changeFlagCount);
    subOpenBlanks(i, j+1, col, nearCount, changeFlagCount);
    subOpenBlanks(i+1, j-1, col, nearCount, changeFlagCount);
    subOpenBlanks(i+1, j, col, nearCount, changeFlagCount);
    subOpenBlanks(i+1, j+1, col, nearCount, changeFlagCount);    
}
function openMines(node, mine, col, changeFlagCount) {
    gameOver = true
    boxOpen(node, changeFlagCount);
    for(var i=0; i < mine.length; i++ ) {
        var r = Math.floor(mine[i]/col);
        var c = mine[i] % col;
        boxOpen(document.getElementById(r+'-'+c), changeFlagCount)
    }
    alert("Game over: failed")
}
function calculateMine(mine, rows, cols, flags) {
    while(mine.length < flags){
        var r = Math.floor(Math.random() * rows * cols) + 1;
        if(mine.indexOf(r) === -1) mine.push(r);
    }
    return mine.sort();
}
function calculateNearCount(nearCount, mine, rows, cols) {
    for(var i=0; i < rows*cols; i++) {
        var cnt = 0;
        if(mine.indexOf(i) !== -1) {
            nearCount.push(-1);
        } else {
            if(mine.indexOf(i-cols) !== -1) {
                cnt += 1;
            }
            if(mine.indexOf(i+cols) !== -1) {
                cnt += 1;
            }
            if(mine.indexOf(i-1) !== -1 && i%cols !== 0 ) {
                cnt += 1;
            }
            if(mine.indexOf(i+1) !== -1 && (i+1)%cols !== 0) {
                cnt += 1;
            }
            if(mine.indexOf(i-cols-1) !== -1 && i%cols !== 0 ) {
                cnt += 1;
            }
            if(mine.indexOf(i+cols-1) !== -1 && i%cols !== 0 ) {
                cnt += 1;
            }
            if(mine.indexOf(i-cols+1) !== -1 && (i+1)%cols !== 0) {
                cnt += 1;
            }
            if(mine.indexOf(i+cols+1) !== -1 && (i+1)%cols !== 0) {
                cnt += 1;
            }
            nearCount.push(cnt);
        }
    }
    return nearCount;
}

function highlightAround() {

}
function checkGameWin(noOfCells, getFlagCount, mineLength) {
    if(noOfCells - boxOpened - mineLength + getFlagCount() === 0) {
        alert("game over: Won");
        gameOver = true;
    }
}
export default class MineArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mine: [],
            nearCount: [],
            difficulty: '',
            openedBoxes: 0,
            gameOver: false
        }
        this.incOpenBox = this.incOpenBox.bind(this);
    }
    incOpenBox() {
        this.setState((prevState) => {
            return {openedBoxes: prevState.openedBoxes + 1} 
        })
    }
    componentDidMount() {
        var rows = this.props.board_details['board']['row'];
        var cols = this.props.board_details['board']['col'];
        var flags = this.props.board_details['flags'];
        var mine = [];
        var nearCount = [];
        mine = calculateMine(mine, rows, cols, flags);
        nearCount = calculateNearCount(nearCount, mine, rows, cols);
        this.setState({
            mine: mine,
            nearCount: nearCount,
            difficulty: this.props.difficulty
        })
    }
    componentDidUpdate() {
        if(this.state.difficulty !== this.props.difficulty) {
            var rows = this.props.board_details['board']['row'];
            var cols = this.props.board_details['board']['col'];
            var flags = this.props.board_details['flags'];
            var elems = document.querySelectorAll(".showMe");
            [].forEach.call(elems, function(el) {
                el.classList.remove("showMe");
                el.parentNode.style.cursor = 'pointer';
            });
            var mine = [];
            var nearCount = [];
            mine = calculateMine(mine, rows, cols, flags);
            nearCount = calculateNearCount(nearCount, mine, rows, cols);
            this.setState({
                mine: mine,
                nearCount: nearCount,
                difficulty: this.props.difficulty
            })
            gameOver = false;
        }
    }

    render() {
        var rows = this.props.board_details['board']['row'];
        var cols = this.props.board_details['board']['col'];
        
        var changeFlagCount = this.props.changeFlagCount;
        return (
            <div>
                <table>
                    {renderTable(rows, cols, this.state.mine.sort(), this.state.nearCount, changeFlagCount, this.props.getFlagCount)}
                </table>
            </div>
        )
    }
}
