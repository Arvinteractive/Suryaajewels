import styles from './Visit.module.css'
import Reveal from './Reveal'

export default function Visit() {
  return (
    <section id="visit" className={styles.section}>
      <div className={styles.text}>
        <Reveal as="div" className={styles.eyebrow}>
          The Studio
        </Reveal>
        <Reveal as="h2" delay={80} className={styles.heading}>
          Witness the Craft
        </Reveal>
        <Reveal as="div" delay={140} className={styles.field}>
          <div className={styles.fieldLabel}>Address</div>
          <div>Suryaa Jewels Craft, Edayar St, Town Hall, Coimbatore, Tamil Nadu 641001</div>
        </Reveal>
        <Reveal as="div" delay={190} className={styles.field}>
          <div className={styles.fieldLabel}>Hours</div>
          <div>Tuesday — Sunday, 10:30 AM – 7:30 PM</div>
        </Reveal>
        <Reveal as="div" delay={240} className={styles.field}>
          <div className={styles.fieldLabel}>Contact</div>
          <div>+91 98765 43210 · hello@suryaajewelscraft.com</div>
          <div>Instagram — @suryaajewelscraft</div>
        </Reveal>
        <a href="#visit" className={styles.cta}>
          Book an Appointment
        </a>
      </div>
      <div className={styles.mapWrap}>
        <iframe
          className={styles.map}
          title="Suryaa Jewels Craft — Atelier location"
          src="https://www.google.com/maps?q=10.9968868,76.9530199(Suryaa+Jewels+Craft)&z=18&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          className={styles.directionsLink}
          href="https://www.google.com/maps/place/Edayar+St,+Kundapur,+Town+Hall,+Coimbatore,+Tamil+Nadu+641001,+India/@10.9970194,76.9527802,19.57z/data=!4m6!3m5!1s0x3ba8590e011c8e67:0xe109219d0bb96bf7!8m2!3d10.9968868!4d76.9530199!16s%2Fg%2F11f4qq5_rj?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>
    </section>
  )
}
