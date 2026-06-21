import BooksMain from '../header/booksMain';
import classes from './styles.module.css'

function Header() {
    return <div className={classes.header}>
        <div style={{width: '80%', height: '90%', marginInline: '10%', position: 'relative', top: '3%'}}>
            <BooksMain/>
        </div>
    </div>
}

export default Header;