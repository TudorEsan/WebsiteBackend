import express from "express"
import nodemailer from 'nodemailer'
import mailValidaion from "../Validation/MailValidation";
import dotenv from 'dotenv'
import e from "express";

class ProjectRoute {
    public router: express.Router

    constructor() {
        this.router = express.Router();
        this.configureRoutes();
    }
    
    private configureRoutes() {
        this.router.get('/', this.getProjects)
    }

    private getProjects(req: express.Request, res: express.Response) {
        try {
			return res.status(200).json({projects: [
    {
        img: '/sdt.jpeg',
        title: 'Secure Document Transfer',
        shortDesc: 'I created this app at a contest named (DPIT - Descopera ti pasiunea in IT/Discover your passion in IT)',
        desc: 'The purpose of this app is to share documents easier. The app has two different types of accounts, providers and regular accounts, the providers can share documents with other accounts. This app is made with react and firebase. The site is only styled for mobile.',
        learnedAbilities: [
            'Work in react',
            'Use firebase',
            'Authenticate users',
            'Do simple styling with css',
        ],
        github: 'https://github.com/ssebastianp/sdt'
    },
    {
        img: '/minimax.png',
        title: 'Maze Solver',
        shortDesc: 'A python app that solves mazes using Lee and A* algorithm',
        desc: 'This app lets you create a maze and find the shortest path to the finish. The solution can be found using 2 different algorithms, one is faster than the other but there is a catch. The A* also knows how far his current position is relative to the finish point.',
        learnedAbilities: [
            'Use more complex algorithms',
            'Build a python GUI',
            'Debugging errors in the algorithm',
        ],
        github: 'https://github.com/TudorEsan/Maze'

    },
    {
        img: '/old-site.png',
        title: 'My older Website',
        shortDesc: 'An older version of my site that I decided to remake',
        desc: 'I decided to remake this site because I did not really like the design and it was not responsive. However, I liked that I created a backend for it where I could log in and keep track of the cryptocurrencies that I had at the time. It was a fun project. At first, my backend ran on a raspberry pi 3 on my network. I struggled quite a lot until I managed to get the HTTPS certificate, only to realize that it was quite expensive to get a static IP :). You can find this site at this address: \n https://tudoresan.netlify.app',
        learnedAbilities: [
            'Build a node backend using express',
            'Use jwt to authenticate',
            'Use Mongo DB',
            'Work with middlewares',
            'Work with Typescript'
        ],
        github: 'https://github.com/TudorEsan/MySite'

    },
    {
        img: '/tictactoe.png',
        title: 'Tic Tac Toe',
        shortDesc: 'A python app that plays tic tac toe against you',
        desc: 'The game uses the minimax algorithm to play against a human. It will predict next moves and will find a way to beat the human player or at least to make a draw.',
        learnedAbilities: [
            'Understand the minimax algorithm',
            'Build a python GUI',
            'Debbuging errors in the algorithm',
        ],
        github: 'https://github.com/TudorEsan/TicTacToe'

    }
]});
		} catch (er) {
			return res.status(400).json({ message: er.message });
		}
    }
}

export default new ProjectRoute().router;