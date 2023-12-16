import { SideBar } from '../cmps/SideBar.jsx'
import { MailList } from "../cmps/MailList.jsx"
import { mailService, Tabs } from "../services/mail.service.js"
import { MailFilter } from '../cmps/MailFilter.jsx'
const { useNavigate, useParams, Outlet } = ReactRouterDOM
const { useState, useEffect } = React

export function MailIndex() {
    const [mails, setMails] = useState([])
    const [unreadCount, setUnreadCount] = useState(0);
    const [openCompose, setOpenCompose] = useState(false)
    const [loadingMails, setLoadingMails] = useState(false)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())
    const params = useParams();

    useEffect(() => {
        const tab = params.tab ? params.tab : Tabs.INBOX;
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, tab, txt: '' }))
    }, [params.tab])

    useEffect(() => {
        if (filterBy.tab) {
            loadMails()
        }
    }, [filterBy])

    function loadMails() {
        setLoadingMails(true)
        mailService.query(filterBy)
            .then(({ mails, unreadCount }) => {
                setUnreadCount(unreadCount);
                setMails(mails)
                setLoadingMails(false)
            })
            .catch(err => console.log('err', err))
    }

    function onUpdateMail(updatedMail) {
        const updatedMails = mails.map(mail => (mail.id === updatedMail.id ? updatedMail : mail))
        setMails(updatedMails);
    }


    function onSendMail(mailToSend) {
        if (params.tab === Tabs.SENT) {
            setMails([...mails, mailToSend])
            setOpenCompose(false)
        }
    }

    function onRemoveMail(mailToRemove) {
        if (mailToRemove.removedAt) {
            mailService.remove(mailToRemove.id)
                .then(() => {
                    setMails(mails.filter(mail => mail.id !== mailToRemove.id));
                })
                .catch(err => console.error('Error removing mail:', err));
        } else {
            const removeMail = {
                ...mailToRemove,
                removedAt: Date.now()
            };
            mailService.save(removeMail)
                .then(() => {
                    setMails(mails.filter(mail => mail.id !== mailToRemove.id));
                })
                .catch(err => console.error('Error removing mail:', err));
        }
    }

    return (
        <section className="mail-index">
            <SideBar {...{ setOpenCompose, openCompose, unreadCount, onSendMail }} />
            <div>
                <MailFilter {...{ setFilterBy, filterBy }} />
                {!params.mailId &&
                    loadingMails ?
                    <img className="loader" src="assets\img\logos\SusMail.png" /> :
                    <MailList {...{ mails, onUpdateMail, onRemoveMail, setUnreadCount }} />}
            </div>
            {params.mailId && <Outlet />}
        </section>
    )
}

