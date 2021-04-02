import App from './App'
import dotenv from "dotenv";
dotenv.config();

App.listen(process.env.PORT || 8000, () => {
	console.log('Server is running')
});
