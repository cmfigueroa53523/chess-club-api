export default async function membersRoutes(app) {
  app.post('/members',
    {
      schema: {
	body: {
	  type: 'object',
	  properties: {
	    firstName: { type: 'string' },
	    lastName: { type: 'string' },
	    age: { type: 'number', nullable: false, minimum: 14 },
	    email: { type: 'string', nullable: false },
	    isActive: { type: 'boolean', nullable: false, default: true },
	    fideRating: { type: 'number', nullable: true, minimum: 1, default: null },
	    profilePhotoUrl: { type: 'string', nullable: true, default: null },
	    lichessProfile: { type: 'string', nullable: true, default: null },
	    chessComProfile: { type: 'string', nullable: true, default: null },
	    fideProfile: { type: 'string', nullable: true, default: null },
	    overDueSubscription: { type: 'boolean', nullable: false, default: false },
	    gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
	  },
	  required: ['firstName', 'lastName', 'age', 'email', 'gender'],
	},
      },
    },
    async(req, res) => {
      const { firstName, lastName, age, email, isActive, fideRating, profilePhotoUrl,
	lichessProfile, chessComProfile, overDueSubscription, gender } = req.body;

      try {
	const insertMember = await app.pg.query(`
        INSERT INTO members (firstname, lastname, age, email, is_active, fide_rating,
        profile_photo_url, lichess_profile, chesscom_profile, overdue_subscription, gender)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
	  [firstName, lastName, age, email, isActive, fideRating, profilePhotoUrl, lichessProfile,
	    chessComProfile, overDueSubscription, gender]
	);
	return { id: insertMember.rows[0].id };
      } catch(error) {
	res.code(error.statusCode || 500);
	req.log.error(error);
	return { msg: 'Could not add new member' };
      }
    });

  app.get('/members', {
    schema: {
      response: {
	200: {
	  type: 'object',
	  properties: {
	    data: { type: 'array' }
	  },
	},
      },
    },
  },
    async(req, res) => {
    try {
      const members = await app.pg.query('SELECT * FROM members');
      return { data: members.rows };
    } catch(error) {
      res.code(error.statusCode || 500);
      req.log.error(error);
      return { msg: 'Could not fetch members' };
    }
    });

  app.get('/members/:id', {
    schema: {
      params: {
	type: 'object',
	properties: {
	  id: { type: 'string' },
	},
	required: ['id'],
      },
      /*
      response: {
	200: {
	  type: 'object',
	  properties: {
	    id: { type: 'string' }
	  }
	}
      }
       */
    },
  },
    async(req, res) => {
      try {
	const { id } = req.params;
	const member = await app.pg.query('SELECT * FROM members WHERE id = $1', [id]);
	return member.rows[0];
      } catch(error) {
	res.code(error.statusCode || 500);
	req.log.error(error);
	return { msg: 'Could not fetch member' };
      }
    });
}
