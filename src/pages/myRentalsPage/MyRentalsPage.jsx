import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./myRentalsPage.css";

const MyRentalsPage = () => {
    const { user } = useAuth();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, "Reservations"),
                    where("userId", "==", user.uid),
                    orderBy("reservedAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const fetchedRentals = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRentals(fetchedRentals);
            } catch (error) {
                console.error("Error fetching rentals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, [user]);

    const handleReturnBook = async (rentalId) => {
        try {
            const rentalRef = doc(db, "Reservations", rentalId);
            await updateDoc(rentalRef, {
                status: "ReturnedByUser"
            });

            // Update local state
            setRentals(prev => prev.map(r =>
                r.id === rentalId ? { ...r, status: "ReturnedByUser" } : r
            ));
            alert("Return request sent! Waiting for admin confirmation.");
        } catch (error) {
            console.error("Error returning book:", error);
            alert("Failed to update return status.");
        }
    };

    if (!user) {
        return (
            <div>
                <Header />
                <div className="myrentals-container" style={{ padding: "100px", textAlign: "center" }}>
                    <h2>Please log in to view your rentals.</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="myrentals-container">
                <h1 className="myrentals-title">My Reservations</h1>

                {loading ? (
                    <p>Loading your reservations...</p>
                ) : rentals.length === 0 ? (
                    <div className="no-rentals">
                        <p>You haven't reserved any books yet.</p>
                        <Link to="/ProductCatalogue">Browse Books</Link>
                    </div>
                ) : (
                    <div className="rentals-list">
                        {rentals.map((rental) => (
                            <div key={rental.id} className="rental-card">
                                <div className="rental-header">
                                    <span className="rental-date">
                                        Reserved on: {rental.reservedAt?.toDate().toLocaleDateString()}
                                    </span>
                                    <span className={`rental-status status-${rental.status}`}>
                                        {rental.status === "ReturnedByUser" ? "Return Pending" :
                                            rental.status === "ReturnedConfirmed" ? "Returned" : rental.status}
                                    </span>
                                </div>

                                <div className="rental-items">
                                    {rental.items.map((item, idx) => (
                                        <div key={idx} className="rental-item">
                                            <img src={item.image} alt={item.name} className="rental-item-img" />
                                            <div className="rental-item-info">
                                                <h4>{item.series}</h4>
                                                <p>{item.variant}</p>
                                                <p>Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="rental-actions">
                                    {rental.status === "Reserved" && (
                                        <button
                                            className="return-btn"
                                            onClick={() => handleReturnBook(rental.id)}
                                        >
                                            Return Books
                                        </button>
                                    )}
                                    {rental.status === "ReturnedByUser" && (
                                        <button className="return-btn disabled" disabled>
                                            Waiting for Confirmation
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyRentalsPage;
