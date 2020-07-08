import React, { Component } from 'react';
import MineArea from './MineAreaComponent';
import './Main.css';

var difficulty_items = {'easy': {board: {row: 12, col: 6}, flags: 10}, 'medium': {board: {row: 20, col: 10}, flags: 35}, 'hard': {board: {row: 26, col: 13}, flags: 75}}
var myTime;
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            difficulty: 'medium',
            flags: 35,
            time: 0
        }
        this.changeFlagCount = this.changeFlagCount.bind(this);
        this.getFlagCount = this.getFlagCount.bind(this);
    }
    changeFlagCount(negPos) {
        this.setState((prevState) => {
            return {flags: prevState.flags + negPos}
        });
    }
    getFlagCount() {
        return this.state.flags
    }
    myTimer = () => {
        this.setState({
            time: this.state.time + 1
        })
    }
    timeCount(newTimer=false) {
        if(newTimer) {
            clearInterval(myTime);
        }
        myTime = setInterval(this.myTimer, 1000);
    }
    componentDidUpdate() {
        this.timeCount(true);
    }
    componentDidMount() {
        this.timeCount();
    }
    render() {
        return (
            <div className="container full">
                <div className="row header">
                    <div className="col-2 flag">
                        <span><img src="https://img.icons8.com/officel/25/000000/filled-flag.png" alt="Flag"/> </span>
                        <span>{this.state.flags}</span>
                    </div>
                    <div className="col-2 time">
                        <span>Time </span>
                        <span>{this.state.time}s</span>
                    </div>
                    <div className="col-6 select-difficulty f-right">
                        <select name="difficulty" id="difficulty" defaultValue={this.state.difficulty} onChange={e => {this.setState({difficulty: e.target.value, flags: difficulty_items[e.target.value]['flags'], time: 0});console.log(difficulty_items[e.target.value]['flags'])}}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>
                <div className="row board">
                    <MineArea difficulty={this.state.difficulty} getFlagCount={this.getFlagCount} board_details={difficulty_items[this.state.difficulty]} changeFlagCount={this.changeFlagCount} />
                </div>
            </div>
        )
    }
}
