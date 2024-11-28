import "./PatientPagesStyles/Notification.css"

const Notification = () =>{
    return (
        <>
        <div class="notification-list-page">
  <h2>Notifications</h2>

  <div class="notification-list">
    
    {/* <!-- Notification Item (Unread) --> */}
    <div class="notification-item unread">
      <div class="notification-subject">
        <strong>Appointment Rescheduled</strong>
      </div>
      <div class="notification-date">
        <p>12th Aug 2023, 10:15 AM</p>
      </div>
    </div>

    {/* <!-- Notification Item (Read) --> */}
    <div class="notification-item read">
      <div class="notification-subject">
        <p>New Lab Report Available</p>
      </div>
      <div class="notification-date">
        <p>11th Aug 2023, 09:30 AM</p>
      </div>
    </div>

    {/* <!-- Notification Item (Unread) --> */}
    <div class="notification-item unread">
      <div class="notification-subject">
        <strong>Doctor's Feedback Received</strong>
      </div>
      <div class="notification-date">
        <p>10th Aug 2023, 02:45 PM</p>
      </div>
    </div>

    {/* <!-- More Notifications... --> */}
  </div>
</div>

        </>
    );
}

export default Notification