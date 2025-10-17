import { useEffect, useMemo, useState } from "react";
import "./App.css";

const FALLBACK_CONTACTS = [
  { id: 1, name: "Vincent Lin", phone: "(646) 111-1111", email: "vincent.lin@example.com", photo: "https://photo.com/1.jpg" },
  { id: 2, name: "Bin Bin Chen", phone: "(646) 111-2222", email: "binbin.chen@example.com", photo: "https://photo.com/2.jpg" },
  { id: 3, name: "Xian Lin", phone: "(646) 000-3333", email: "xian.lin@example.com", photo: "https://photo.com/3.jpg" },
  { id: 4, name: "Ryan Chen", phone: "(646) 000-0104", email: "ryan.chen@example.com", photo: "https://photo.com/4.jpg" },
  { id: 5, name: "Joanna Chen", phone: "(646) 222-0105", email: "joanna.chen@example.com", photo: "https://photo.com/5.jpg" },
  { id: 6, name: "Christina Lin", phone: "(646) 222-0106", email: "christina.lin@example.com", photo: "https://photo.com/6.jpg" },
  { id: 7, name: "Angela Huang", phone: "(646) 333-0107", email: "angela.huang@example.com", photo: "https://photo.com/7.jpg" },
  { id: 8, name: "Jia Li", phone: "(646) 333-0108", email: "jia.li@example.com", photo: "https://photo.com/8.jpg" },
  { id: 9, name: "Chengling Zheng", phone: "(646) 555-0109", email: "chengling.zheng@example.com", photo: "https://photo.com/9.jpg" },
  { id: 10, name: "Xiurong Gao", phone: "(646) 555-0110", email: "xiurong.gao@example.com", photo: "https://photo.com/10.jpg" },
];  

const App = () => {
  const [contacts, setContacts] = useState(FALLBACK_CONTACTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [formErrors, setFormErrors] = useState ({}) ;

  //Fetch contacts from contacts.json
useEffect ( () => {
  async function fetchContacts() {
    setLoading (true);
    try {
      const res = await fetch("/data/contacts.json");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      
      const mergedContacts = [
        ...FALLBACK_CONTACTS,
        ...(Array.isArray(data) ? data : []),
      ];
      setContacts(mergedContacts);
      
    } catch (err) {
        console.error ("Error", err);
        setContacts (FALLBACK_CONTACTS);
        setError ("Could not load contacts.");
    } finally {
      setLoading (false);
    }
  }
  fetchContacts();
}, []);

//Filter contacts on phone or number
    const filteredContacts = contacts.filter(
      (c)=>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query)
  );

      const contactToShow = filteredContacts[currentPage];
      
      function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
      }

      //Validate data inputted
      function validateForm() {
        const errors = {};
        if (!form.name || form.name.length < 2)
        errors.name = "Name must be at least 2 characters.";
        const phonePattern = /^[0-9]+$/;
  if (!form.phone) {
    errors.phone = "Phone is required.";
  } else if (!phonePattern.test(form.phone)) {
    errors.phone = "Phone must contain only numbers";
  }
        if (!form.email.includes("@")) 
          errors.email = "Email must include '@'.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      }

      //Add new contact
      function handleSubmit (e) {
        e.preventDefault();
        if (!validateForm()) return;
        const newContact = {
          id: Date.now(),
          ...form,
        };
        
      //Reset form after submit
        setContacts([newContact, ...contacts]);
        setForm({name: "", phone: "", email: ""});
        setFormErrors({});
        setCurrentPage(0);
      }

  return (
    <main className="page" data-testid="page-root">
    <header className="page__header">
    <h1 className="page__title">Phonebook Challenge</h1>
      </header>

    <section className="search" aria-labelledby="search-heading">
    <h2 id="search-heading">Search Contacts</h2>
    <div className="search__controls">
    <input
      id="search-input"
      type="search"
      placeholder="Search by name or phone"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setCurrentPage(0);
      }}
      data-testid="search-input"
      />
      <button
        
      className="btn search-btn"
      type="button"
      onClick={() => console.log("Searching for:", query)}
      >
      Search
        </button>  
    </div>

    <p className="search__results" data-testid="results-count">
      {loading ? " (loading...)" : ""}
      {error ? ` (error: ${error})` : ""}
      </p>
        </section>

  <section className="contacts" aria-labelledby="contacts-heading">
    <h2 id="contacts-heading">Contacts</h2>

    {filteredContacts.length == 0 && <p>No contacts found.</p>}

  {contactToShow && ( 
  <div className="contact-card"> 
    <h3 
    className="contact-card__name"
    dangerouslySetInnerHTML={{
    __html: highlightMatch(contactToShow.name, query),
      }}
    />
    <p className="contact-card__phone"
    dangerouslySetInnerHTML={{
      __html: highlightMatch(contactToShow.phone, query),
    }}
  />
    <p className="contact-card__email">{contactToShow.email}</p> 
    </div> 
     )}
<div 
style={{ 
  display: "flex", 
  justifyContent: "center", 
  marginTop: "1rem" 
  }}
  >
  <div className="pagination">
    <button
    className="btn"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
    disabled={currentPage === 0}
  >
    Previous
    </button>

    <button
    className="btn"
    onClick={() =>
      setCurrentPage((prev) =>
      Math.min(prev + 1, filteredContacts.length - 1)
      )
    }
    disabled={currentPage === filteredContacts.length - 1}
    >
      Next
    </button>
  </div>
  </div>
  </section>
            
  <section className="form" aria-labelledby="form-heading">
    <h2 id="form-heading">Add a Contact</h2>

      <form className="form__body" onSubmit={handleSubmit} noValidate>
      <div className="field">
      <label htmlFor="Name">Name</label>
      <input
        id="Name"
        name="Name"
        placeholder="First and Last Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        minLength={2}
        aria-invalid={!!formErrors.name}
        aria-describedby="name-error"
          />
  {formErrors.name && (
    <small id="name-error" style={{ color: "salmon" }}>{formErrors.name}</small>
    )}
  </div>
    
  <div className="field">
    <label htmlFor="phone">Phone</label>
    <input
      id="phone"
      name="phone"
      inputMode="tel"
      placeholder="(555) 555-5555"
      value={form.phone}
      onChange={(e) =>
      setForm({ ...form, phone: e.target.value })
      }
      required
      aria-invalid={!!formErrors.phone}
      aria-describedby="phone-error"
      />

{formErrors.phone && (
    <small id="phone-error" style={{ color: "salmon" }}>{formErrors.phone}</small>
    )}

      </div>
    <div className="field">
      <label htmlFor="email">Email</label>
        <input
         id="email"
         name="email"
         type="email"
         placeholder="example@email.com"
         value={form.email}
         onChange={(e) =>
         setForm({ ...form, email: e.target.value })
         }
         aria-invalid={!!formErrors.email}
         aria-describedby="email-error"
       />
         {formErrors.email && (
    <small id="email-error" style={{ color: "salmon" }}>{formErrors.email}</small>
    )}

   </div>
    <div className="form__actions">
      <button className="btn" type="submit" data-testid="btn-add">
       Add Contact
       </button>
       </div>
      </form>
       </section>

      <footer className="page__footer">
     </footer>
    </main>
    );
};

export default App;
